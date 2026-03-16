export type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  audience: string;
  durationMinutes: number;
  priceLabel: string;
  deliveryMode: string;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
};

export type ClassSession = {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  locationName: string;
  locationAddress: string;
  capacity: number;
  availableSpots: number;
  status: "scheduled" | "cancelled" | "completed";
  isRecurring: boolean;
};

export type Booking = {
  id: string;
  serviceId: string;
  classId: string | null;
  requestType: "scheduled" | "custom";
  preferredDate: string | null;
  name: string;
  email: string;
  phone: string;
  note: string;
  status: "pending" | "confirmed" | "cancelled" | "archived";
  privacyAccepted: boolean;
  createdAt: string;
};

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  categoryId: string;
  featured: boolean;
  publishedAt: string;
  readTime: string;
  status: "draft" | "published";
  metaTitle: string;
  metaDescription: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
};

export type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  isVisible: boolean;
  sortOrder: number;
};

export type SiteSettings = {
  studioName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  locationName: string;
  mapEmbedUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
};

export type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  role: "owner" | "editor" | "assistant";
  previewMode: boolean;
};

export type DashboardStats = {
  bookingCount: number;
  upcomingClassCount: number;
  unreadMessageCount: number;
  publishedPostCount: number;
};

export type AdminDashboardSnapshot = {
  stats: DashboardStats;
  upcomingClasses: Array<{
    id: string;
    title: string;
    startsAt: string;
    endsAt: string;
  }>;
  recentBookings: Array<{
    id: string;
    name: string;
    email: string;
    status: Booking["status"];
  }>;
  recentMessages: Array<{
    id: string;
    subject: string;
    name: string;
    email: string;
  }>;
};

export type MediaAsset = {
  name: string;
  url: string;
  bucket: string;
  createdAt: string;
};
