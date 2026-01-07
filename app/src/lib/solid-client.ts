/**
 * Solid Pod Client
 *
 * This module provides functions to fetch profile data from Solid Pods.
 * Uses @inrupt/solid-client for actual Pod interactions.
 *
 * In demo mode (when Pods aren't running), it gracefully falls back
 * to the demo data bundled with the app.
 *
 * Note: In containerized environments (like KASM), the browser may not be
 * able to reach localhost services directly. This client uses a server-side
 * proxy for localhost Pod URLs to work around network isolation.
 */

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrl,
} from '@inrupt/solid-client';
import { FOAF, VCARD } from '@inrupt/vocab-common-rdf';

/**
 * Custom fetch that proxies localhost requests through the Next.js server
 * to work around container network isolation in dev environments.
 */
function createProxiedFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // Check if this is a localhost Pod URL that needs proxying
    if (url.includes('localhost:3002') || url.includes('127.0.0.1:3002')) {
      // In browser environment, use the proxy
      if (typeof window !== 'undefined') {
        const proxyUrl = `/api/pod-proxy?url=${encodeURIComponent(url)}`;
        return fetch(proxyUrl, init);
      }
    }

    // Otherwise, use direct fetch
    return fetch(input, init);
  };
}

export interface SolidProfile {
  name?: string;
  role?: string;
  email?: string;
  skills?: string[];
  photo?: string;
}

/**
 * Fetch a profile from a Solid Pod using the WebID
 *
 * @param webId - The WebID URL pointing to the person's profile document
 * @returns The profile data, or null if the Pod is unavailable
 */
export async function fetchSolidProfile(webId: string): Promise<SolidProfile | null> {
  try {
    // Fetch the WebID document from the Pod
    // Use proxied fetch for localhost URLs in browser environment
    const dataset = await getSolidDataset(webId, {
      fetch: createProxiedFetch(),
    });

    // Get the profile Thing from the dataset
    const profile = getThing(dataset, webId);
    if (!profile) {
      return null;
    }

    // Extract profile fields using standard vocabularies
    const name =
      getStringNoLocale(profile, FOAF.name) ||
      getStringNoLocale(profile, VCARD.fn);

    const role =
      getStringNoLocale(profile, VCARD.role) ||
      getStringNoLocale(profile, VCARD.title);

    const email = getUrl(profile, VCARD.hasEmail) || getUrl(profile, FOAF.mbox);

    // VCARD.expertise isn't in the standard vocab, use a custom predicate or note field
    // For skills, we try vcard:note or a custom predicate
    const skillsRaw = getStringNoLocale(profile, VCARD.note);
    const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()) : [];

    const photo = getUrl(profile, FOAF.img) || getUrl(profile, VCARD.hasPhoto);

    return {
      name: name || undefined,
      role: role || undefined,
      email: email?.replace('mailto:', '') || undefined,
      skills: skills.length > 0 ? skills : undefined,
      photo: photo || undefined,
    };
  } catch (error) {
    // Pod unavailable, network error, or CORS issue
    // This is expected in demo mode when Pods aren't running
    console.debug(`[Solid] Could not fetch profile from ${webId}:`, error);
    return null;
  }
}

/**
 * Check if a Pod server is reachable
 *
 * @param podUrl - Base URL of the Pod server
 * @returns true if the Pod server responds, false otherwise
 */
export async function isPodServerAvailable(podUrl: string): Promise<boolean> {
  try {
    const proxiedFetch = createProxiedFetch();
    const response = await proxiedFetch(podUrl, {
      method: 'HEAD',
      mode: 'cors',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Demo Pod server URL (for local development)
 * Must match the port in pods/setup-pods.sh
 */
export const DEMO_POD_SERVER = 'http://localhost:3002';
