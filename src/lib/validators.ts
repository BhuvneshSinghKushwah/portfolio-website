import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(200),
  message: z.string().min(1, "Message is required").max(2000),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const linkCreateSchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug characters").optional(),
  metadata: z.record(z.string(), z.string().max(500)).default({}),
  is_active: z.boolean().default(true),
});

export const linkUpdateSchema = z.object({
  metadata: z.record(z.string(), z.string().max(500)).optional(),
  is_active: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const profileSchema = z.object({
  full_name: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  bio: z.string().max(1000),
  email: z.string().email(),
  phone: z.string().max(20),
  linkedin_url: z.string().url().or(z.literal("")),
  github_url: z.string().url().or(z.literal("")),
  resume_url: z.string().max(500),
});

export const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  start_date: z.string().min(1).max(50),
  end_date: z.string().min(1).max(50),
  description: z.array(z.string().max(500)).min(1),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(200),
  tagline: z.string().max(300),
  description: z.string().max(2000),
  github_url: z.string().url().or(z.literal("")),
  live_url: z.string().url().or(z.literal("")).nullable(),
  tech_tags: z.array(z.string().max(50)),
  year: z.string().max(10),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const skillSchema = z.object({
  category: z.string().min(1).max(100),
  items: z.array(z.string().max(50)).min(1),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const educationSchema = z.object({
  institution: z.string().min(1).max(300),
  degree: z.string().min(1).max(300),
  location: z.string().max(200),
  grade: z.string().max(50),
  year: z.string().max(20),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const reorderSchema = z.object({
  table: z.enum(["experiences", "projects", "skills", "education"]),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      sort_order: z.number().int().min(0),
    })
  ),
});

export const visitSchema = z.object({
  link_id: z.string().uuid(),
  referrer: z.string().max(2000).nullable().optional(),
  user_agent: z.string().max(1000).nullable().optional(),
});

export const beaconSchema = z.object({
  visit_id: z.string().uuid(),
});
