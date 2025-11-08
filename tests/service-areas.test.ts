import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import the route handlers under test
import * as ServiceAreasRoute from '../app/api/service-areas/route';

// Mocks
const makeCookies = () => ({
  get: (_name: string) => undefined,
  set: (_name: string, _value: string) => {},
  remove: (_name: string) => {},
});

// We'll mock Supabase SSR client to return a stubbed client used in handlers
const makeSupabaseStub = (impl: Partial<any> = {}) => ({
  auth: {
    getSession: vi.fn(async () => ({ data: { session: { user: { id: 'user1' } } } })),
  },
  from: vi.fn((table: string) => {
    // Default builders per table used in these handlers
    if (table === 'service_areas') {
      const builder: any = {
        select: vi.fn((_sel?: string) => builder),
        eq: vi.fn((_col: string, _val: any) => builder),
        single: vi.fn(async () => ({ data: { facility_id: 'fac1' }, error: null })),
        delete: vi.fn(() => ({ eq: vi.fn((_col: string, _val: any) => ({ error: null })) })),
        insert: vi.fn(async (_rows: any[]) => ({ data: [{ id: 'new1' }], error: null })),
        update: vi.fn((_updates: any) => ({ eq: vi.fn((_col: string, _val: any) => ({ data: [{ id: 'upd1' }], error: null })) })),
      };
      return builder;
    }
    if (table === 'facilities') {
      const builder: any = {
        select: vi.fn((_sel?: string) => builder),
        eq: vi.fn((_col: string, _val: any) => builder),
        single: vi.fn(async () => ({ data: { org_id: 'org1' }, error: null })),
      };
      return builder;
    }
    if (table === 'users') {
      const builder: any = {
        select: vi.fn((_sel?: string) => builder),
        eq: vi.fn((_col: string, _val: any) => builder),
        single: vi.fn(async () => ({ data: { id: 'user1', role: 'admin', org_id: 'org1' }, error: null })),
      };
      return builder;
    }
    return { select: vi.fn(() => ({ })) };
  }),
  ...impl,
});

// Mock @/lib/rbac helpers to bypass deeper DB checks where appropriate
vi.mock('../lib/rbac', () => {
  return {
    canViewServiceAreas: vi.fn(async () => ({ id: 'user1', role: 'admin', org_id: 'org1' })),
    canManageServiceAreas: vi.fn(async () => ({ id: 'user1', role: 'admin', org_id: 'org1' })),
  };
});

// Mock @supabase/ssr to return our stubbed client
vi.mock('@supabase/ssr', () => {
  return {
    createServerClient: vi.fn(() => makeSupabaseStub()),
  };
});

// Helper to create a mock NextRequest-like object
const makeRequest = (url: string, body?: any): NextRequest | any => {
  return {
    url,
    cookies: makeCookies(),
    json: body ? (async () => body) : undefined,
  } as any;
};

describe('Service Areas API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns areas for a facility (happy path)', async () => {
    // Override service_areas select->eq to return specific data
    const areas = [
      { id: 'a1', facility_id: 'fac1', lat: 1, lng: 2, radius_miles: 10 },
      { id: 'a2', facility_id: 'fac1', lat: 3, lng: 4, radius_miles: 5 },
    ];

    const supabase = makeSupabaseStub();
    // Override module mock to return this stub for this test
    const ssr = await import('@supabase/ssr');
    (ssr.createServerClient as any).mockReturnValueOnce({
      ...supabase,
      from: vi.fn((table: string) => {
        if (table === 'service_areas') {
          const builder: any = {
            select: vi.fn(() => builder),
            eq: vi.fn(() => ({ data: areas, error: null })),
          };
          return builder;
        }
        return (supabase as any).from(table);
      }),
    });

    const req = makeRequest('http://localhost/api/service-areas?facilityId=fac1');
    const res = await ServiceAreasRoute.GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.areas)).toBe(true);
    expect(json.areas.length).toBe(2);
  });

  it('POST returns 403 when not allowed', async () => {
    // Force canManageServiceAreas to return a 403 response
  const rbac = await import('../lib/rbac');
    (rbac.canManageServiceAreas as any).mockResolvedValueOnce(
      NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    );

    const req = makeRequest('http://localhost/api/service-areas', {
      facilityId: 'fac1',
      areas: [
        { lat: 1, lng: 2, radiusMiles: 10 },
      ],
    });

    const res = await ServiceAreasRoute.POST(req);
    expect(res.status).toBe(403);
  });

  it('DELETE returns 403 when not allowed', async () => {
    // Ensure resolving facility_id works, then RBAC rejects
    const supabase = makeSupabaseStub();
    const ssr = await import('@supabase/ssr');
    (ssr.createServerClient as any).mockReturnValueOnce(supabase);

  const rbac = await import('../lib/rbac');
    (rbac.canManageServiceAreas as any).mockResolvedValueOnce(
      NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    );

    const req = makeRequest('http://localhost/api/service-areas?id=sa1');
    const res = await ServiceAreasRoute.DELETE(req);
    expect(res.status).toBe(403);
  });
});
