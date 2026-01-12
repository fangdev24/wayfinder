'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface GraphFilters {
  showServices: boolean;
  showPatterns: boolean;
  showPolicies: boolean;
  showAgents: boolean;
  selectedDepartment: string;
}

interface GraphLayout {
  /** How strongly nodes cluster by department (0-100) */
  clumping: number;
  /** How spread out the graph is (0-100) */
  spacing: number;
}

interface GraphContextValue {
  filters: GraphFilters;
  layout: GraphLayout;
  setShowServices: (show: boolean) => void;
  setShowPatterns: (show: boolean) => void;
  setShowPolicies: (show: boolean) => void;
  setShowAgents: (show: boolean) => void;
  setSelectedDepartment: (department: string) => void;
  setClumping: (value: number) => void;
  setSpacing: (value: number) => void;
  resetFilters: () => void;
  resetLayout: () => void;
}

const defaultFilters: GraphFilters = {
  showServices: true,
  showPatterns: true,
  showPolicies: true,
  showAgents: true,
  selectedDepartment: 'all',
};

const defaultLayout: GraphLayout = {
  clumping: 30,
  spacing: 50,
};

const GraphContext = createContext<GraphContextValue | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GraphFilters>(defaultFilters);
  const [layout, setLayout] = useState<GraphLayout>(defaultLayout);

  const setShowServices = (show: boolean) => {
    setFilters(prev => ({ ...prev, showServices: show }));
  };

  const setShowPatterns = (show: boolean) => {
    setFilters(prev => ({ ...prev, showPatterns: show }));
  };

  const setShowPolicies = (show: boolean) => {
    setFilters(prev => ({ ...prev, showPolicies: show }));
  };

  const setShowAgents = (show: boolean) => {
    setFilters(prev => ({ ...prev, showAgents: show }));
  };

  const setSelectedDepartment = (department: string) => {
    setFilters(prev => ({ ...prev, selectedDepartment: department }));
  };

  const setClumping = (value: number) => {
    setLayout(prev => ({ ...prev, clumping: value }));
  };

  const setSpacing = (value: number) => {
    setLayout(prev => ({ ...prev, spacing: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
  };

  return (
    <GraphContext.Provider
      value={{
        filters,
        layout,
        setShowServices,
        setShowPatterns,
        setShowPolicies,
        setShowAgents,
        setSelectedDepartment,
        setClumping,
        setSpacing,
        resetFilters,
        resetLayout,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraphFilters() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraphFilters must be used within a GraphProvider');
  }
  return context;
}
