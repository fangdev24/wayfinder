# Solid Pod Integration Patterns

> **Status**: Documented from implementation experience
> **Date**: 2026-01-07
> **Context**: Wayfinder demo - integrating W3C Solid Pods for decentralized profile data

## Overview

This document captures learnings from integrating Solid Pods into a Next.js application, including common pitfalls, authentication patterns, and workarounds for development environments.

---

## What is Solid?

**Solid** (Social Linked Data) is a W3C specification created by Tim Berners-Lee that enables decentralized data storage. Key concepts:

- **Pod**: A personal data store that users control
- **WebID**: A URL that uniquely identifies a person (e.g., `http://pod.example/alice/profile/card#me`)
- **Linked Data**: Data stored as RDF (Resource Description Framework) using standard vocabularies

### Why Solid for Government?

1. **Data Sovereignty**: Departments own their data in their own Pods
2. **No Central Database**: Wayfinder doesn't store profile data - it fetches from Pods
3. **User Control**: People update their own profiles
4. **Standards-Based**: W3C specifications, not vendor lock-in

---

## Community Solid Server (CSS)

### Version Differences (CSS 6.x vs 7.x)

CSS 7.x introduced breaking changes:

| Feature | CSS 6.x | CSS 7.x |
|---------|---------|---------|
| Seed config flag | `--seededPodConfigJson` | `--seedConfig` |
| Seed config format | `{ "accounts": [...] }` | `[...]` (array at root) |
| Default profile path | `/profile#me` | `/profile/card#me` |
| Account API | Different endpoints | `/.account/` structure |

### Seed Configuration (CSS 7.x)

```json
[
  {
    "name": "flint-rivers",
    "email": "flint.rivers@example.gov",
    "password": "demo123",
    "pods": [{ "name": "flint-rivers" }]
  }
]
```

**Important**: The seed config creates accounts and empty pods, but does NOT populate profile data. Profile fields (name, role, skills) must be added separately.

### Starting CSS 7.x

```bash
npx @solid/community-server \
    -p 3002 \
    -c @css:config/file.json \
    -f ./data \
    --seedConfig seed-config.json
```

---

## Profile Data Structure

CSS stores profiles as Turtle (TTL) files using RDF vocabularies:

```turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix vcard: <http://www.w3.org/2006/vcard/ns#>.

<>
    a foaf:PersonalProfileDocument;
    foaf:maker <http://localhost:3002/flint-rivers/profile/card#me>;
    foaf:primaryTopic <http://localhost:3002/flint-rivers/profile/card#me>.

<http://localhost:3002/flint-rivers/profile/card#me>
    solid:oidcIssuer <http://localhost:3002/>;
    a foaf:Person;
    foaf:name "Flint Rivers";
    vcard:fn "Flint Rivers";
    vcard:role "Senior Data Engineer";
    vcard:hasEmail <mailto:flint.rivers@example.gov>;
    vcard:note "Python, Spark, Data Architecture, AWS".
```

### Common Vocabularies

| Vocabulary | Prefix | Used For |
|------------|--------|----------|
| FOAF | `foaf:` | Basic person info (name, knows, img) |
| vCard | `vcard:` | Contact details (email, role, phone) |
| Solid | `solid:` | Solid-specific (oidcIssuer, storage) |

### File Storage Location

CSS with file-based storage stores profiles at:
```
.data/{pod-name}/profile/card$.ttl
```

The `$` suffix indicates it's a metadata file that CSS serves as the main resource.

---

## Client Integration (@inrupt/solid-client)

### Basic Profile Fetching

```typescript
import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrl,
} from '@inrupt/solid-client';
import { FOAF, VCARD } from '@inrupt/vocab-common-rdf';

async function fetchProfile(webId: string) {
  const dataset = await getSolidDataset(webId);
  const profile = getThing(dataset, webId);

  return {
    name: getStringNoLocale(profile, FOAF.name),
    role: getStringNoLocale(profile, VCARD.role),
    email: getUrl(profile, VCARD.hasEmail),
  };
}
```

### Custom Fetch for Proxying

The library accepts a custom `fetch` function for network customization:

```typescript
const dataset = await getSolidDataset(webId, {
  fetch: customFetchFunction,
});
```

---

## Container/VM Network Isolation Problem

### The Issue

In containerized environments (KASM, Docker, etc.), the browser often runs in a different network namespace than the terminal/server:

```
Terminal (curl) → localhost:3002 → ✓ Works
Browser         → localhost:3002 → ✗ ERR_CONNECTION_REFUSED
```

The browser's `localhost` doesn't resolve to the same network as the container's localhost.

### Symptoms

- `curl http://localhost:3002` works from terminal
- Browser shows `ERR_CONNECTION_REFUSED`
- Same machine, different results

### Solution: Server-Side Proxy

Route browser requests through the Next.js server, which shares the terminal's network:

```
Browser → Next.js API → Pod Server
         (same network namespace)
```

**Proxy API Route** (`/api/pod-proxy/route.ts`):

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const podUrl = searchParams.get('url');

  // Security: Only allow localhost Pod server
  const targetUrl = new URL(podUrl);
  if (!['localhost:3002', '127.0.0.1:3002'].includes(targetUrl.host)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const response = await fetch(podUrl, {
    headers: { Accept: 'text/turtle' },
  });

  return new NextResponse(await response.text(), {
    headers: { 'Content-Type': response.headers.get('content-type') },
  });
}
```

**Client-Side Proxy Detection**:

```typescript
function createProxiedFetch(): typeof fetch {
  return async (input, init) => {
    const url = typeof input === 'string' ? input : input.url;

    // Proxy localhost Pod URLs in browser
    if (url.includes('localhost:3002') && typeof window !== 'undefined') {
      return fetch(`/api/pod-proxy?url=${encodeURIComponent(url)}`, init);
    }

    return fetch(input, init);
  };
}
```

---

## CSS 7.x Authentication Flow

CSS 7.x uses a multi-step authentication process:

### 1. Login (Get Account Token)

```bash
POST /.account/login/password/
Content-Type: application/json

{"email": "user@example.com", "password": "secret"}
```

Response includes `authorization` token for account operations.

### 2. Get Account Controls

```bash
GET /.account/
Authorization: CSS-Account-Token {token}
```

Returns URLs for `clientCredentials`, `webId`, `pod` management.

### 3. Create Client Credentials (for API Access)

```bash
POST /.account/account/{id}/client-credentials/
Authorization: CSS-Account-Token {token}
Content-Type: application/json

{"name": "my-client", "webId": "http://pod/user/profile/card#me"}
```

Returns `id` and `secret` for OAuth2-style access.

### 4. Writing to Pods

For authenticated writes, use the client credentials with DPoP (Demonstration of Proof-of-Possession) or equivalent. This is complex for demos.

**Simpler Alternative**: For local development, edit the TTL files directly on disk.

---

## Development Tips

### 1. Multiple Next.js Servers

Watch out for port conflicts:
- Port 3000: Production build (`next start`)
- Port 3001: Dev server (`next dev`)

New API routes only appear in the dev server until rebuilt.

### 2. Profile Data Seeding

CSS seed config doesn't populate profile fields. Options:

1. **Direct file editing** (simplest for demos):
   ```bash
   echo '@prefix foaf: ...' > .data/user/profile/card$.ttl
   ```

2. **SPARQL PATCH** (requires auth):
   ```sparql
   INSERT DATA {
     <#me> foaf:name "Name" .
   }
   ```

3. **Init script with client credentials** (complex but automatable)

### 3. Debugging Pod Requests

Check CSS logs for request handling:
```bash
# CSS logs show all requests
2026-01-07T16:33:42.685Z [CSS] info: GET /flint-rivers/profile/card
```

Use verbose curl to see headers:
```bash
curl -v http://localhost:3002/user/profile/card -H "Accept: text/turtle"
```

### 4. React Query Caching

The app uses React Query with 5-minute cache (`staleTime: 5 * 60 * 1000`). During development, use browser DevTools to clear cache or reduce staleTime.

---

## Architecture Decision: Graceful Degradation

The Wayfinder app implements a **graceful degradation** pattern:

1. Try to fetch from Pod
2. If Pod unavailable, fall back to bundled demo data
3. Show status indicator (green = live, grey = offline)

```typescript
const person = podData
  ? { ...fallbackData, ...podData }  // Pod takes precedence
  : fallbackData;                     // Demo data fallback
```

This ensures the app works both with and without running Pods.

---

## Security Considerations

### Proxy Security

The pod-proxy route **must** restrict which URLs can be proxied:

```typescript
const allowedHosts = ['localhost:3002', '127.0.0.1:3002'];
if (!allowedHosts.includes(targetUrl.host)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

Without this, the proxy becomes an open relay for arbitrary requests.

### Production vs Development

| Concern | Development | Production |
|---------|-------------|------------|
| Pod URLs | localhost:3002 | pods.department.gov.uk |
| Proxy | Required (KASM) | Not needed (public URLs) |
| Auth | Bypassed for demo | Full Solid-OIDC |
| Data | Seeded demos | Real user data |

---

## References

- [Solid Project](https://solidproject.org/)
- [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer)
- [Inrupt Solid Client Libraries](https://docs.inrupt.com/developer-tools/javascript/client-libraries/)
- [W3C Solid Protocol](https://solidproject.org/TR/protocol)
- [FOAF Vocabulary](http://xmlns.com/foaf/spec/)
- [vCard Ontology](https://www.w3.org/TR/vcard-rdf/)
