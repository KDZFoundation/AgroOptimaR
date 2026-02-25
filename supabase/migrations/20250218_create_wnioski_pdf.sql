-- Migration script for creating 'wnioski_pdf' table and storage bucket
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create 'wnioski_pdf' table
CREATE TABLE IF NOT EXISTS wnioski_pdf (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rolnik_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kampania_rok INTEGER NOT NULL,
    nazwa_pliku TEXT NOT NULL,
    plik_url TEXT,
    status_parsowania TEXT CHECK (status_parsowania IN ('oczekujacy', 'sukces', 'blad')) DEFAULT 'oczekujacy',
    dane_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_wnioski_rolnik_id ON wnioski_pdf(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_wnioski_kampania_rok ON wnioski_pdf(kampania_rok);

-- Enable Row Level Security (RLS)
ALTER TABLE wnioski_pdf ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own applications
CREATE POLICY "Users can view own wnioski_pdf" ON wnioski_pdf
    FOR SELECT USING (auth.uid() = rolnik_id);

-- Create policy to allow users to insert their own applications
CREATE POLICY "Users can insert own wnioski_pdf" ON wnioski_pdf
    FOR INSERT WITH CHECK (auth.uid() = rolnik_id);

-- Create policy to allow users to update their own applications
CREATE POLICY "Users can update own wnioski_pdf" ON wnioski_pdf
    FOR UPDATE USING (auth.uid() = rolnik_id);

-- Create policy to allow users to delete their own applications
CREATE POLICY "Users can delete own wnioski_pdf" ON wnioski_pdf
    FOR DELETE USING (auth.uid() = rolnik_id);


-- STORAGE BUCKET SETUP (This usually needs to be done via dashboard or API, but SQL can hint structure)
-- We assume a bucket named 'wnioski' exists.
-- Policy for storage objects:
-- Users can upload to 'wnioski' bucket if they are authenticated.
-- Users can read objects from 'wnioski' bucket if (bucket_id = 'wnioski' AND auth.uid() = owner_id_in_path) -- simplified logic
