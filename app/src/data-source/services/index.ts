import type { Service } from '../schema';

import { dsoServices } from './dso-services';
import { dcsServices } from './dcs-services';
import { rtsServices } from './rts-services';
import { biaServices } from './bia-services';
import { vlaServices } from './vla-services';
import { nhdsServices } from './nhds-services';

/**
 * All Services Combined
 *
 * Total: 75 services across 6 departments
 *
 * Breakdown:
 * - DSO (Digital Standards Office): 14 services (shared platforms)
 * - DCS (Citizen Support): 14 services (benefits & welfare)
 * - RTS (Revenue & Taxation): 15 services (tax & income)
 * - BIA (Border & Identity): 16 services (identity & border)
 * - VLA (Vehicle & Licensing): 12 services (vehicles & drivers)
 * - NHDS (Health Data): 14 services (health records)
 */

export const services: Service[] = [
  ...dsoServices,
  ...dcsServices,
  ...rtsServices,
  ...biaServices,
  ...vlaServices,
  ...nhdsServices,
];

// Export individual department services for filtering
export {
  dsoServices,
  dcsServices,
  rtsServices,
  biaServices,
  vlaServices,
  nhdsServices,
};

// Helper to get services by department
export function getServicesByDepartment(departmentId: string): Service[] {
  return services.filter((s) => s.departmentId === departmentId);
}

// Helper to get services by team
export function getServicesByTeam(teamId: string): Service[] {
  return services.filter((s) => s.teamId === teamId);
}

// Helper to get service by ID
export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

// Helper to get all services that consume a given service
export function getConsumers(serviceId: string): Service[] {
  return services.filter((s) => s.dependsOn.includes(serviceId));
}

// Helper to get all dependencies for a service
export function getDependencies(serviceId: string): Service[] {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return services.filter((s) => service.dependsOn.includes(s.id));
}

export default services;
