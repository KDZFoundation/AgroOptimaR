# Deployment Guide for AgroOptimaR

This guide provides instructions for deploying the AgroOptimaR application (Next.js 16 + Supabase).

## Prerequisites

1.  **Node.js**: Version 20.x or higher.
2.  **Supabase Project**: A live Supabase project.
3.  **Anthropic API Key**: For the AI-powered PDF parsing features.

## 1. Environment Variables

Create a `.env` or set these variables in your deployment platform (e.g., Vercel, Netlify, Docker):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Configuration (Server-side only)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## 2. Database Setup

You need to apply the database migrations to set up the schema, including the new Admin module and PDF application tracking.

Run the following SQL scripts in your Supabase SQL Editor (in this order):

1.  **`supabase/migrations/20250218_create_admin_schema.sql`**
    *   Creates `profiles` table with roles (`rolnik`, `doradca`, `admin`).
    *   Creates dictionary tables (`slownik_uprawy`, `slownik_ekoschematy`).
    *   Sets up Row Level Security (RLS) policies.

2.  **`supabase/migrations/20250218_create_wnioski_pdf.sql`**
    *   Creates `wnioski_pdf` table for storing application metadata.
    *   Sets up RLS policies for application access.

## 3. Storage Setup

1.  Go to the **Storage** section in your Supabase Dashboard.
2.  Create a new bucket named **`wnioski`**.
3.  Ensure the bucket is **private** (default).
4.  (Optional) If RLS policies from the migration script didn't apply automatically to storage, add a policy allowing authenticated users to upload and read their own files.

## 4. Admin User Setup

The application does not have a public registration form for Administrators. To create the first Admin:

1.  Sign up a new user via the `/rejestracja` page in the application.
2.  Go to your Supabase **Table Editor** > **`profiles`**.
3.  Find the user you just created.
4.  Change their `role` column value from `rolnik` to `admin`.
5.  This user can now access the `/admin` dashboard.

## 5. Build and Deploy

### Vercel (Recommended)

1.  Import the repository to Vercel.
2.  Set the **Root Directory** to `./` (the root of the repo).
3.  Add the environment variables listed in Step 1.
4.  Deploy.

**Note:** The repository contains a nested project `lovable-agro/` (Vite). This is a separate prototype and is excluded from the main Next.js build configuration (`tsconfig.json`). Ensure your deployment command targets the root `package.json`.

### Manual / Docker

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Build the application:
    ```bash
    npm run build
    ```
3.  Start the server:
    ```bash
    npm start
    ```

## 6. Verification

After deployment:
1.  Go to `/login` and sign in.
2.  Navigate to `/wnioski-pdf` and try uploading a PDF.
3.  If you are an Admin, navigate to `/admin` to verify access to the dashboard.
