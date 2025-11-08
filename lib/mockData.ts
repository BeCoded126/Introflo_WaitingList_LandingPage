// Mock data for development preview when Supabase is not configured
import type { Facility, Match } from "@/types";

export const mockFacilities: Facility[] = [
  {
    id: "1",
    name: "Sunrise Senior Living",
    description:
      "Premier assisted living facility with 24/7 care and modern amenities",
    address: "123 Oak Street, San Francisco, CA 94102",
    organizationId: "org1",
    status: "published",
    logoUrl:
      "https://ui-avatars.com/api/?name=Sunrise+Senior+Living&background=4F46E5&color=fff&size=200",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "2",
    name: "Golden Years Care Center",
    description:
      "Specialized memory care with compassionate staff and engaging activities",
    address: "456 Maple Ave, Oakland, CA 94601",
    organizationId: "org2",
    status: "published",
    logoUrl:
      "https://ui-avatars.com/api/?name=Golden+Years&background=10B981&color=fff&size=200",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-10-28"),
  },
  {
    id: "3",
    name: "Peaceful Meadows Retirement",
    description: "Independent living community with resort-style amenities",
    address: "789 Pine Road, Berkeley, CA 94704",
    organizationId: "org3",
    status: "published",
    logoUrl:
      "https://ui-avatars.com/api/?name=Peaceful+Meadows&background=F59E0B&color=fff&size=200",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-11-02"),
  },
  {
    id: "4",
    name: "Harbor View Health Services",
    description:
      "Skilled nursing facility with rehabilitation and therapy programs",
    address: "321 Harbor Blvd, San Leandro, CA 94577",
    organizationId: "org4",
    status: "published",
    logoUrl:
      "https://ui-avatars.com/api/?name=Harbor+View&background=8B5CF6&color=fff&size=200",
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "5",
    name: "Evergreen Assisted Living",
    description:
      "Family-owned facility providing personalized care in a home-like setting",
    address: "555 Elm Drive, Alameda, CA 94501",
    organizationId: "org5",
    status: "published",
    logoUrl:
      "https://ui-avatars.com/api/?name=Evergreen+Living&background=EC4899&color=fff&size=200",
    createdAt: new Date("2024-05-12"),
    updatedAt: new Date("2024-11-03"),
  },
  {
    id: "6",
    name: "Lakeside Senior Residence",
    description: "Upscale community with fine dining and wellness programs",
    address: "999 Lake Shore Dr, Emeryville, CA 94608",
    organizationId: "org6",
    status: "published",
    logoUrl:
      "https://ui-avatars.com/api/?name=Lakeside+Residence&background=06B6D4&color=fff&size=200",
    createdAt: new Date("2024-06-18"),
    updatedAt: new Date("2024-11-04"),
  },
];

export const mockMatches: (Match & { facility: Facility })[] = [
  {
    id: "m1",
    facilityId: "1",
    matchedWith: "2",
    score: 0.92,
    createdAt: new Date("2024-11-01"),
    facility: mockFacilities[1],
  },
  {
    id: "m2",
    facilityId: "1",
    matchedWith: "3",
    score: 0.87,
    createdAt: new Date("2024-11-02"),
    facility: mockFacilities[2],
  },
  {
    id: "m3",
    facilityId: "1",
    matchedWith: "4",
    score: 0.81,
    createdAt: new Date("2024-11-03"),
    facility: mockFacilities[3],
  },
  {
    id: "m4",
    facilityId: "1",
    matchedWith: "5",
    score: 0.78,
    createdAt: new Date("2024-11-04"),
    facility: mockFacilities[4],
  },
  {
    id: "m5",
    facilityId: "1",
    matchedWith: "6",
    score: 0.75,
    createdAt: new Date("2024-11-05"),
    facility: mockFacilities[5],
  },
];

export const mockServiceAreas = [
  {
    id: "sa1",
    lat: 37.7749,
    lng: -122.4194,
    radiusMiles: 15,
    city: "San Francisco",
    state: "CA",
  },
  {
    id: "sa2",
    lat: 37.8044,
    lng: -122.2712,
    radiusMiles: 10,
    city: "Oakland",
    state: "CA",
  },
  {
    id: "sa3",
    lat: 37.8716,
    lng: -122.2727,
    radiusMiles: 12,
    city: "Berkeley",
    state: "CA",
  },
];
