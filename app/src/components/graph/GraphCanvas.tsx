'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';
import { getGraphData, getServiceById, getPatternById, type GraphNode, type GraphEdge } from '@/lib/data';
import { useGraphFilters } from './GraphContext';

// Department colours matching the legend
const DEPARTMENT_COLOURS: Record<string, string> = {
  dso: '#00703c',
  dcs: '#1d70b8',
  rts: '#912b88',
  bia: '#d4351c',
  vla: '#f47738',
  nhds: '#005eb8',
  patterns: '#505a5f',
};

interface SimNode extends d3.SimulationNodeDatum, GraphNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimEdge extends d3.SimulationLinkDatum<SimNode> {
  type: string;
  crossDepartment?: boolean;
}

/**
 * GraphCanvas - Interactive D3.js force-directed knowledge graph
 *
 * Features:
 * - Force-directed layout with physics simulation
 * - Department-based node colouring
 * - Fullscreen mode for exploration
 * - Click to select, double-click to navigate
 * - Drag nodes to rearrange
 * - Zoom and pan
 * - Tooltip on hover
 */
export function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimEdge> | null>(null);
  const linkRef = useRef<d3.Selection<SVGLineElement, SimEdge, SVGGElement, unknown> | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [tooltipData, setTooltipData] = useState<{ node: SimNode; x: number; y: number } | null>(null);
  const selectedNodeRef = useRef<SimNode | null>(null);

  // Keep ref in sync with state for use in D3 event handlers
  selectedNodeRef.current = selectedNode;

  const router = useRouter();
  const { filters, layout } = useGraphFilters();

  // Calculate force strengths from layout sliders
  // Clumping: 0 = no clustering, 100 = strong clustering toward group centers
  // Spacing: 0 = dense/close, 100 = spread out
  const clumpingStrength = layout.clumping / 100; // 0 to 1
  const spacingStrength = -100 - (layout.spacing * 6); // -100 to -700

  // Filter graph data based on current filters
  const filteredData = useMemo(() => {
    const { nodes: rawNodes, edges: rawEdges } = getGraphData();

    // Filter nodes
    const filteredNodes = rawNodes.filter(node => {
      // Filter by node type
      if (node.type === 'service' && !filters.showServices) return false;
      if (node.type === 'pattern' && !filters.showPatterns) return false;

      // Filter by department
      if (filters.selectedDepartment !== 'all') {
        // Patterns don't have departments, so show them if patterns are enabled
        if (node.type === 'pattern') return true;
        if (node.department !== filters.selectedDepartment) return false;
      }

      return true;
    });

    // Get set of visible node IDs for edge filtering
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));

    // Filter edges to only include those between visible nodes
    const filteredEdges = rawEdges.filter(edge =>
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [filters]);

  // Toggle native browser fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Sync state with native fullscreen changes (handles Escape key automatically)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Apply persistent animation to edges connected to selected node
  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    if (selectedNode) {
      // Apply animation to connected edges
      link
        .attr('stroke-opacity', l => {
          const source = typeof l.source === 'object' ? l.source.id : l.source;
          const target = typeof l.target === 'object' ? l.target.id : l.target;
          return source === selectedNode.id || target === selectedNode.id ? 1 : 0.2;
        })
        .attr('stroke-width', l => {
          const source = typeof l.source === 'object' ? l.source.id : l.source;
          const target = typeof l.target === 'object' ? l.target.id : l.target;
          const isConnected = source === selectedNode.id || target === selectedNode.id;
          return isConnected ? 2.5 : (l.crossDepartment ? 2 : 1);
        })
        .classed('edge-animated', l => {
          const source = typeof l.source === 'object' ? l.source.id : l.source;
          return source === selectedNode.id;
        })
        .classed('edge-animated-reverse', l => {
          const source = typeof l.source === 'object' ? l.source.id : l.source;
          const target = typeof l.target === 'object' ? l.target.id : l.target;
          return target === selectedNode.id && source !== selectedNode.id;
        });
    } else {
      // Clear all animations when deselected
      link
        .attr('stroke-opacity', 1)
        .attr('stroke-width', l => l.crossDepartment ? 2 : 1)
        .classed('edge-animated', false)
        .classed('edge-animated-reverse', false);
    }
  }, [selectedNode]);

  // Initialize D3 graph
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Create mutable copies for D3 from filtered data
    const nodes: SimNode[] = filteredData.nodes.map(n => ({ ...n }));
    const edges: SimEdge[] = filteredData.edges.map(e => ({
      source: e.source,
      target: e.target,
      type: e.type,
      crossDepartment: e.crossDepartment,
    }));

    // Clear any existing SVG
    d3.select(container).select('svg').remove();

    // Get dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svgRef.current = svg.node();

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create main group for transformations
    const g = svg.append('g');

    // Create arrow markers for directed edges
    svg.append('defs').selectAll('marker')
      .data(['consumes', 'depends-on', 'implements'])
      .enter().append('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', d => d === 'implements' ? '#b1b4b6' : '#505a5f')
      .attr('d', 'M0,-5L10,0L0,5');

    // Calculate cluster centers for each department (arranged in a circle)
    const groups = ['dso', 'dcs', 'rts', 'bia', 'vla', 'nhds', 'patterns'];
    const clusterCenters: Record<string, { x: number; y: number }> = {};
    groups.forEach((group, i) => {
      const angle = (i / groups.length) * 2 * Math.PI - Math.PI / 2;
      const radius = Math.min(width, height) * 0.3;
      clusterCenters[group] = {
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
      };
    });

    // Create force simulation with configurable forces
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimEdge>(edges)
        .id(d => d.id)
        .distance(80)
        .strength(0.4))
      .force('charge', d3.forceManyBody().strength(spacingStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25))
      // Clustering force: pull nodes toward their department's cluster center
      .force('clusterX', d3.forceX<SimNode>(d => {
        const center = clusterCenters[d.group || 'patterns'];
        return center ? center.x : width / 2;
      }).strength(clumpingStrength * 0.8))
      .force('clusterY', d3.forceY<SimNode>(d => {
        const center = clusterCenters[d.group || 'patterns'];
        return center ? center.y : height / 2;
      }).strength(clumpingStrength * 0.8));

    simulationRef.current = simulation;

    // Create edges
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', d => d.crossDepartment ? '#d4351c' : (d.type === 'implements' ? '#b1b4b6' : '#505a5f'))
      .attr('stroke-width', d => d.crossDepartment ? 2 : 1)
      .attr('stroke-dasharray', d => d.type === 'implements' ? '4,4' : 'none')
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Store link selection for use in selection effect
    linkRef.current = link;

    // Create node group
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add shapes based on node type
    node.each(function(d) {
      const el = d3.select(this);
      const color = d.group ? DEPARTMENT_COLOURS[d.group] || '#1d70b8' : '#1d70b8';

      if (d.type === 'pattern') {
        // Diamond shape for patterns
        el.append('rect')
          .attr('width', 16)
          .attr('height', 16)
          .attr('x', -8)
          .attr('y', -8)
          .attr('transform', 'rotate(45)')
          .attr('fill', color)
          .attr('stroke', '#0b0c0c')
          .attr('stroke-width', 1);
      } else {
        // Circle for services
        el.append('circle')
          .attr('r', 10)
          .attr('fill', color)
          .attr('stroke', '#0b0c0c')
          .attr('stroke-width', 1);
      }
    });

    // Add labels
    node.append('text')
      .text(d => d.label.length > 20 ? d.label.substring(0, 18) + '...' : d.label)
      .attr('x', 14)
      .attr('y', 4)
      .attr('font-size', '11px')
      .attr('fill', '#0b0c0c')
      .attr('pointer-events', 'none');

    // Interaction handlers
    node
      .on('mouseover', function(event, d) {
        const [x, y] = d3.pointer(event, container);
        setTooltipData({ node: d, x, y });

        // Highlight and animate connected edges
        link
          .attr('stroke-opacity', l => {
            const source = typeof l.source === 'object' ? l.source.id : l.source;
            const target = typeof l.target === 'object' ? l.target.id : l.target;
            return source === d.id || target === d.id ? 1 : 0.2;
          })
          .attr('stroke-width', l => {
            const source = typeof l.source === 'object' ? l.source.id : l.source;
            const target = typeof l.target === 'object' ? l.target.id : l.target;
            const isConnected = source === d.id || target === d.id;
            return isConnected ? 2.5 : (l.crossDepartment ? 2 : 1);
          })
          .classed('edge-animated', l => {
            // Animate outgoing edges (source is hovered node)
            const source = typeof l.source === 'object' ? l.source.id : l.source;
            return source === d.id;
          })
          .classed('edge-animated-reverse', l => {
            // Animate incoming edges in reverse (target is hovered node)
            const source = typeof l.source === 'object' ? l.source.id : l.source;
            const target = typeof l.target === 'object' ? l.target.id : l.target;
            return target === d.id && source !== d.id;
          });
      })
      .on('mouseout', function() {
        setTooltipData(null);
        // Only reset if no node is selected - selection effect handles selected node styling
        const selected = selectedNodeRef.current;
        if (selected) {
          // Restore selection styling
          link
            .attr('stroke-opacity', l => {
              const source = typeof l.source === 'object' ? l.source.id : l.source;
              const target = typeof l.target === 'object' ? l.target.id : l.target;
              return source === selected.id || target === selected.id ? 1 : 0.2;
            })
            .attr('stroke-width', l => {
              const source = typeof l.source === 'object' ? l.source.id : l.source;
              const target = typeof l.target === 'object' ? l.target.id : l.target;
              const isConnected = source === selected.id || target === selected.id;
              return isConnected ? 2.5 : (l.crossDepartment ? 2 : 1);
            })
            .classed('edge-animated', l => {
              const source = typeof l.source === 'object' ? l.source.id : l.source;
              return source === selected.id;
            })
            .classed('edge-animated-reverse', l => {
              const source = typeof l.source === 'object' ? l.source.id : l.source;
              const target = typeof l.target === 'object' ? l.target.id : l.target;
              return target === selected.id && source !== selected.id;
            });
        } else {
          // No selection - reset all edges
          link
            .attr('stroke-opacity', 1)
            .attr('stroke-width', l => l.crossDepartment ? 2 : 1)
            .classed('edge-animated', false)
            .classed('edge-animated-reverse', false);
        }
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        setSelectedNode(prev => prev?.id === d.id ? null : d);
      })
      .on('dblclick', function(event, d) {
        event.stopPropagation();
        if (d.type === 'service') {
          router.push(`/services/${d.id}`);
        } else if (d.type === 'pattern') {
          router.push(`/patterns/${d.id}`);
        }
      });

    // Click on background to deselect
    svg.on('click', () => {
      setSelectedNode(null);
    });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x || 0)
        .attr('y1', d => (d.source as SimNode).y || 0)
        .attr('x2', d => (d.target as SimNode).x || 0)
        .attr('y2', d => (d.target as SimNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
      svg.remove();
    };
  }, [isFullscreen, router, filteredData]); // Re-render when fullscreen or filters change

  // Update force strengths dynamically when layout sliders change
  // This avoids rebuilding the whole graph - just updates physics
  useEffect(() => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    // Update charge (spacing) force
    const chargeForce = simulation.force('charge') as d3.ForceManyBody<SimNode> | undefined;
    if (chargeForce) {
      chargeForce.strength(spacingStrength);
    }

    // Update cluster forces (clumping)
    const clusterXForce = simulation.force('clusterX') as d3.ForceX<SimNode> | undefined;
    const clusterYForce = simulation.force('clusterY') as d3.ForceY<SimNode> | undefined;
    if (clusterXForce) {
      clusterXForce.strength(clumpingStrength * 0.8);
    }
    if (clusterYForce) {
      clusterYForce.strength(clumpingStrength * 0.8);
    }

    // Reheat the simulation to apply changes
    simulation.alpha(0.3).restart();
  }, [clumpingStrength, spacingStrength]);

  // Get selected entity details
  const getSelectedDetails = () => {
    if (!selectedNode) return null;

    if (selectedNode.type === 'service') {
      return getServiceById(selectedNode.id);
    } else if (selectedNode.type === 'pattern') {
      return getPatternById(selectedNode.id);
    }
    return null;
  };

  const selectedDetails = getSelectedDetails();

  return (
    <div
      ref={containerRef}
      className="wayfinder-graph"
      aria-label="Knowledge graph visualization"
      role="img"
      style={{ position: 'relative' }}
    >
      {/* Fullscreen toggle button */}
      <button
        type="button"
        className="govuk-button govuk-button--secondary"
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          margin: 0,
        }}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      </button>

      {/* Instructions when empty */}
      {isFullscreen && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 10,
            background: 'rgba(255,255,255,0.95)',
            padding: '10px 15px',
            borderLeft: '4px solid #1d70b8',
            fontSize: '14px',
          }}
        >
          <strong>Controls:</strong> Drag nodes to move • Scroll to zoom • Press Escape to exit
        </div>
      )}

      {/* Tooltip */}
      {tooltipData && (
        <div
          className="govuk-body-s"
          style={{
            position: 'absolute',
            left: tooltipData.x + 15,
            top: tooltipData.y - 10,
            background: 'rgba(255,255,255,0.98)',
            border: '1px solid #b1b4b6',
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 20,
            maxWidth: '250px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <strong>{tooltipData.node.label}</strong>
          <br />
          <span style={{ color: '#505a5f' }}>
            {tooltipData.node.type === 'service' ? 'Service' : 'Pattern'}
            {tooltipData.node.department && ` • ${tooltipData.node.department.toUpperCase()}`}
          </span>
          <br />
          <em style={{ fontSize: '12px', color: '#505a5f' }}>
            Click to select • Double-click to view details
          </em>
        </div>
      )}

      {/* Selected node panel */}
      {selectedNode && selectedDetails && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '280px',
            background: 'rgba(255,255,255,0.98)',
            border: '1px solid #b1b4b6',
            borderLeft: `4px solid ${selectedNode.group ? DEPARTMENT_COLOURS[selectedNode.group] || '#1d70b8' : '#1d70b8'}`,
            padding: '15px',
            zIndex: 15,
            maxHeight: isFullscreen ? '80vh' : '400px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">{selectedNode.label}</h3>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                lineHeight: 1,
              }}
              aria-label="Close panel"
            >
              ×
            </button>
          </div>

          <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-tag govuk-tag--grey" style={{ marginRight: '8px' }}>
              {selectedNode.type}
            </span>
            {selectedNode.department && (
              <span className="govuk-tag" style={{ background: DEPARTMENT_COLOURS[selectedNode.department] }}>
                {selectedNode.department.toUpperCase()}
              </span>
            )}
          </p>

          <p className="govuk-body-s">
            {'description' in selectedDetails ? selectedDetails.description : ''}
          </p>

          <button
            type="button"
            className="govuk-button govuk-!-margin-bottom-0"
            onClick={() => {
              if (selectedNode.type === 'service') {
                router.push(`/services/${selectedNode.id}`);
              } else if (selectedNode.type === 'pattern') {
                router.push(`/patterns/${selectedNode.id}`);
              }
            }}
          >
            View details
          </button>
        </div>
      )}
    </div>
  );
}
