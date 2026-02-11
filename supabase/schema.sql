-- Portfolio Database Schema
-- Run this in Supabase SQL Editor to set up all tables, RLS policies, views, and functions.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- CMS Tables
-- =====================

CREATE TABLE personal_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  live_url TEXT,
  tech_tags TEXT[] DEFAULT '{}',
  year TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  items TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  location TEXT DEFAULT '',
  grade TEXT DEFAULT '',
  year TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- Tracking Tables
-- =====================

CREATE TABLE trackable_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE link_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES trackable_links(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  ip_address TEXT DEFAULT '',
  country TEXT,
  city TEXT,
  region TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_link_visits_link_id ON link_visits(link_id);
CREATE INDEX idx_link_visits_visited_at ON link_visits(visited_at);
CREATE INDEX idx_trackable_links_slug ON trackable_links(slug);
CREATE INDEX idx_contact_submissions_is_read ON contact_submissions(is_read);

-- =====================
-- Analytics Summary View
-- =====================

CREATE OR REPLACE VIEW link_analytics_summary AS
SELECT
  tl.id,
  tl.slug,
  tl.metadata,
  tl.created_at,
  tl.is_active,
  COALESCE(COUNT(lv.id), 0)::INT AS total_visits,
  MAX(lv.visited_at) AS last_visited_at,
  COUNT(DISTINCT lv.country)::INT AS unique_countries,
  AVG(
    CASE
      WHEN lv.exited_at IS NOT NULL
      THEN EXTRACT(EPOCH FROM (lv.exited_at - lv.visited_at))
    END
  ) AS avg_session_duration
FROM trackable_links tl
LEFT JOIN link_visits lv ON tl.id = lv.link_id
GROUP BY tl.id, tl.slug, tl.metadata, tl.created_at, tl.is_active;

-- =====================
-- Visit Exit Function (SECURITY DEFINER)
-- =====================

CREATE OR REPLACE FUNCTION record_visit_exit(p_visit_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE link_visits
  SET exited_at = NOW()
  WHERE id = p_visit_id AND exited_at IS NULL;
END;
$$;

-- =====================
-- Row Level Security
-- =====================

ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE trackable_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for visible CMS content
CREATE POLICY "Public can read personal_info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public can read visible experiences" ON experiences FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible projects" ON projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible skills" ON skills FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible education" ON education FOR SELECT USING (is_visible = true);

-- Public can read active links by slug
CREATE POLICY "Public can read active links" ON trackable_links FOR SELECT USING (is_active = true);

-- Public can insert visits
CREATE POLICY "Public can insert visits" ON link_visits FOR INSERT WITH CHECK (true);

-- Public can insert contact submissions
CREATE POLICY "Public can insert contacts" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Authenticated admin: full access to all tables
CREATE POLICY "Admin full access personal_info" ON personal_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access education" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access trackable_links" ON trackable_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access link_visits" ON link_visits FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
