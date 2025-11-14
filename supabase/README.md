# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in or create an account
2. Click "New Project"
3. Fill in the project details:
   - Project name: `tsr-tracking-app` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for the project to be provisioned

## 2. Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## 3. Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-url-here` and `your-anon-key-here` with the values you copied.

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## 4. Execute the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

This will create:
- `profiles` table for user information
- `posts` table for TSR records
- `timeline_events` table for audit history
- `timeline_event_type` enum
- All necessary indexes for performance
- Row Level Security (RLS) policies
- Automatic `updated_at` trigger

## 5. Verify the Setup

After running the migration, verify that the tables were created:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see three tables: `profiles`, `posts`, and `timeline_events`
3. Check that the indexes were created by going to **Database** → **Indexes**

## 6. Optional: Set Up Authentication

If you haven't already configured authentication:

1. Go to **Authentication** → **Providers**
2. Enable your preferred authentication method (Email, Google, GitHub, etc.)
3. Configure the provider settings as needed

## Database Schema Overview

### Tables

- **profiles**: Stores user profile information
- **posts**: Stores the current state of each TSR
- **timeline_events**: Stores the complete audit history of all changes

### Indexes

- `idx_posts_updated_at`: Optimizes board view sorting
- `idx_posts_response_due`: Optimizes filtering by due date
- `idx_timeline_events_post_id`: Optimizes timeline queries for a specific post
- `idx_timeline_events_created_at`: Optimizes global timeline queries

### Row Level Security

All tables have RLS enabled with policies that:
- Allow authenticated users to view all records
- Allow authenticated users to create records (with their user ID)
- Allow authenticated users to update posts (collaborative editing)

## Troubleshooting

### Migration Fails

If the migration fails:
1. Check the error message in the SQL editor
2. Ensure you're running the entire migration file
3. Verify that the `uuid-ossp` extension is available
4. Try running the migration in smaller chunks if needed

### Can't Connect from Next.js

If you can't connect to Supabase from your app:
1. Verify your `.env.local` file has the correct credentials
2. Restart your Next.js development server
3. Check that the environment variables are prefixed with `NEXT_PUBLIC_`
4. Verify your Supabase project is active and not paused

### RLS Blocking Queries

If queries are being blocked by RLS:
1. Ensure users are authenticated before accessing data
2. Check that the RLS policies match your use case
3. For development, you can temporarily disable RLS on specific tables (not recommended for production)
