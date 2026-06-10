-- Run this in Supabase SQL Editor
-- Creates the contact_messages table used by app/api/contact/route.ts.
-- The API writes with the service role key, so no anon policies are needed.

CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT,
  email      TEXT,
  message    TEXT        NOT NULL,
  source     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: only service role can read/write
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access" ON contact_messages FOR ALL TO anon USING (false);
