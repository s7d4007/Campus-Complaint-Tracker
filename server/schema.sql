-- ============================================================
-- Campus Complaint Tracker – Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────
CREATE TYPE complaint_category AS ENUM (
  'infrastructure', 'hostel', 'academics', 'canteen', 'transport', 'safety', 'other'
);

CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE complaint_status AS ENUM ('open', 'in_progress', 'resolved', 'rejected');

CREATE TYPE user_role AS ENUM ('student', 'admin');

-- ─── Tables ───────────────────────────────────────────────────

-- Users (custom auth, not Supabase Auth)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'student',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints
CREATE TABLE complaints (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  category    complaint_category NOT NULL,
  priority    complaint_priority NOT NULL DEFAULT 'medium',
  status      complaint_status  NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Complaint Images (Supabase Storage)
CREATE TABLE complaint_images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id  UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Assignments (admin assigns complaint to themselves or another admin)
CREATE TABLE assignments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id  UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  assigned_to   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  complaint_id  UUID REFERENCES complaints(id) ON DELETE SET NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id  UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_complaints_user_id   ON complaints(user_id);
CREATE INDEX idx_complaints_status    ON complaints(status);
CREATE INDEX idx_complaints_category  ON complaints(category);
CREATE INDEX idx_notifications_user   ON notifications(user_id, is_read);
CREATE INDEX idx_comments_complaint   ON comments(complaint_id);

-- ─── Row Level Security (RLS) ─────────────────────────────────
-- NOTE: Because we use service role key on the backend,
-- RLS is bypassed. Enable policies below only if you later
-- use the anon/user key directly from the frontend.

ALTER TABLE users              DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints         DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_images   DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments        DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments           DISABLE ROW LEVEL SECURITY;

-- ─── Storage ──────────────────────────────────────────────────
-- Create the storage bucket manually in Supabase Dashboard:
-- Storage → New Bucket → Name: "complaint-images" → Public: true
