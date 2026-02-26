
-- Add plik_url column to wnioski_pdf table
ALTER TABLE public.wnioski_pdf
ADD COLUMN IF NOT EXISTS plik_url text;

-- Optional: Add a comment or description if needed
COMMENT ON COLUMN public.wnioski_pdf.plik_url IS 'Path to the uploaded PDF file in Supabase Storage';
