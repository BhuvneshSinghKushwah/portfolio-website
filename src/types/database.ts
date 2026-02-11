export interface PersonalInfo {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string[];
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  github_url: string;
  live_url: string | null;
  tech_tags: string[];
  year: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
  sort_order: number;
  is_visible: boolean;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  grade: string;
  year: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrackableLink {
  id: string;
  slug: string;
  metadata: Record<string, string>;
  created_at: string;
  is_active: boolean;
}

export interface LinkVisit {
  id: string;
  link_id: string;
  visited_at: string;
  exited_at: string | null;
  ip_address: string;
  country: string | null;
  city: string | null;
  region: string | null;
  referrer: string | null;
  user_agent: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface LinkAnalyticsSummary {
  id: string;
  slug: string;
  metadata: Record<string, string>;
  created_at: string;
  is_active: boolean;
  total_visits: number;
  last_visited_at: string | null;
  unique_countries: number;
  avg_session_duration: number | null;
}
