export interface User {
  id: string;
  email: string;
  name?: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  status: "pending" | "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  description?: string;
  address: string;
  // Optional logo fields; either camelCase or snake_case may be present depending on source
  logoUrl?: string;
  logo_url?: string;
  organizationId: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  // Profile fields
  images?: string[];
  insurances?: string[];
  services?: string[];
  bio?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceArea {
  id: string;
  postalCode: string;
  facilityId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  facilityId: string;
  matchedWith: string;
  score: number;
  createdAt: Date;
}

export interface Referral {
  id: string;
  senderId: string;
  receiverId: string;
  patientId?: string;
  notes?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  facilityId: string;
  email: string;
  name?: string;
  phone?: string;
  status: "new" | "contacted" | "qualified" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  organizationId: string;
  plan: "basic" | "pro" | "enterprise";
  status: "active" | "past_due" | "canceled";
  stripeId?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
