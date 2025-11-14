# TSR Tracking Application

A Next.js-based web application for tracking Technical Service Requests (TSRs) with full audit history.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Follow the detailed setup instructions in `supabase/README.md`
   - Execute the database migration from `supabase/migrations/001_initial_schema.sql`

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and configurations
│   ├── supabase/        # Supabase client setup
│   ├── validation/      # Zod schemas
│   ├── actions/         # Server actions
│   └── utils/           # Helper functions
└── supabase/            # Database migrations
```

## Development

This project follows the spec-driven development approach. See `.kiro/specs/tsr-tracking-app/` for:
- Requirements document
- Design document
- Implementation tasks

## License

Private - Internal use only
