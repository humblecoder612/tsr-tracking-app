# Design Document

## Overview

The TSR Tracking Application is a Next.js-based web application using the App Router architecture with TypeScript. It leverages Supabase for database, authentication, and storage, with shadcn/ui components styled using Tailwind CSS. The application follows a server-first architecture using React Server Components (RSC) where possible, with client components only for interactive elements like forms.

The core architecture separates current state (stored in `posts` table) from historical events (stored in `timeline_events` table), enabling full audit trails while maintaining query performance for current data.

## Architecture

### Technology Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Deployment**: Vercel (recommended) or similar

### Application Structure

```
app/
├── layout.tsx                 # Root layout with auth provider
├── page.tsx                   # Root redirect to /board
├── board/
│   └── page.tsx              # TSR table view (RSC)
├── new/
│   └── page.tsx              # TSR creation form
└── post/
    └── [id]/
        └── page.tsx          # TSR detail + timeline (RSC)

components/
├── ui/                       # shadcn/ui components
├── tsr-form.tsx             # Create TSR form (client component)
├── tsr-table.tsx            # TSR table display
├── tsr-timeline.tsx         # Timeline display component
├── tsr-summary-card.tsx     # Post summary display
├── add-comment-form.tsx     # Comment submission form (client component)
└── edit-tsr-form.tsx        # Edit TSR fields form (client component)

lib/
├── supabase/
│   ├── server.ts            # Server-side Supabase client
│   ├── client.ts            # Client-side Supabase client
│   └── middleware.ts        # Auth middleware
├── validation/
│   └── schemas.ts           # Zod validation schemas
├── actions/
│   ├── create-post.ts       # Server action for creating posts
│   ├── add-comment.ts       # Server action for adding comments
│   └── update-post.ts       # Server action for updating posts
└── utils/
    ├── date-format.ts       # Date formatting utilities
    └── types.ts             # Shared TypeScript types

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema
```

### Rendering Strategy

- **Server Components (RSC)**: Used for data fetching and static content
  - `/board` page - fetches and displays all posts
  - `/post/[id]` page - fetches post and timeline data
  - Timeline display components
  - Summary cards

- **Client Components**: Used only for interactive elements
  - Forms (TSR creation, comments, edits)
  - Interactive buttons with state
  - Toast notifications

## Components and Interfaces

### Database Schema

#### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### posts table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  tsr_number TEXT NOT NULL,
  response_due DATE NOT NULL,
  end_a TEXT NOT NULL,
  end_z TEXT NOT NULL,
  data_rate_required TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_updated_at ON posts(updated_at DESC);
CREATE INDEX idx_posts_response_due ON posts(response_due);
```

#### timeline_events table
```sql
CREATE TYPE timeline_event_type AS ENUM ('POST_CREATED', 'FIELD_CHANGED', 'COMMENT');

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  event_type timeline_event_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- For POST_CREATED and COMMENT
  body TEXT,
  
  -- For FIELD_CHANGED
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  
  CONSTRAINT valid_post_created CHECK (
    event_type != 'POST_CREATED' OR body IS NOT NULL
  ),
  CONSTRAINT valid_field_changed CHECK (
    event_type != 'FIELD_CHANGED' OR (field_name IS NOT NULL AND old_value IS NOT NULL AND new_value IS NOT NULL)
  ),
  CONSTRAINT valid_comment CHECK (
    event_type != 'COMMENT' OR body IS NOT NULL
  )
);

CREATE INDEX idx_timeline_events_post_id ON timeline_events(post_id, created_at DESC);
CREATE INDEX idx_timeline_events_created_at ON timeline_events(created_at DESC);
```

### TypeScript Types

```typescript
// lib/utils/types.ts

export type TimelineEventType = 'POST_CREATED' | 'FIELD_CHANGED' | 'COMMENT';

export interface Post {
  id: string;
  identifier: string;
  tsr_number: string;
  response_due: string;
  end_a: string;
  end_z: string;
  data_rate_required: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  post_id: string;
  event_type: TimelineEventType;
  created_at: string;
  created_by: string | null;
  body?: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  author?: {
    full_name: string | null;
  };
}

export interface PostWithTimeline extends Post {
  timeline_events: TimelineEvent[];
}
```

### Zod Validation Schemas

```typescript
// lib/validation/schemas.ts

import { z } from 'zod';

export const createPostSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required').max(50, 'Identifier must be 50 characters or less'),
  tsrNumber: z.string().min(1, 'TSR Number is required'),
  responseDue: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Response Due must be a valid date',
  }),
  endA: z.string().min(1, 'End A is required'),
  endZ: z.string().min(1, 'End Z is required'),
  dataRateRequired: z.string().min(1, 'Data Rate Required is required'),
  comments: z.string().max(2000, 'Comments must be 2000 characters or less').optional(),
});

export const addCommentSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  body: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment must be 2000 characters or less'),
});

export const updatePostSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  identifier: z.string().min(1).max(50).optional(),
  tsrNumber: z.string().min(1).optional(),
  responseDue: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  endA: z.string().min(1).optional(),
  endZ: z.string().min(1).optional(),
  dataRateRequired: z.string().min(1).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
```

### Server Actions

#### Create Post Action
```typescript
// lib/actions/create-post.ts

'use server'

import { createClient } from '@/lib/supabase/server';
import { createPostSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const supabase = createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }
  
  // Validate input
  const rawData = {
    identifier: formData.get('identifier'),
    tsrNumber: formData.get('tsrNumber'),
    responseDue: formData.get('responseDue'),
    endA: formData.get('endA'),
    endZ: formData.get('endZ'),
    dataRateRequired: formData.get('dataRateRequired'),
    comments: formData.get('comments') || undefined,
  };
  
  const validation = createPostSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }
  
  const data = validation.data;
  
  // Insert post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      identifier: data.identifier,
      tsr_number: data.tsrNumber,
      response_due: data.responseDue,
      end_a: data.endA,
      end_z: data.endZ,
      data_rate_required: data.dataRateRequired,
      created_by: user.id,
    })
    .select()
    .single();
    
  if (postError || !post) {
    return { error: 'Failed to create post' };
  }
  
  // Create initial timeline event
  const { error: timelineError } = await supabase
    .from('timeline_events')
    .insert({
      post_id: post.id,
      event_type: 'POST_CREATED',
      body: data.comments || 'TSR created',
      created_by: user.id,
    });
    
  if (timelineError) {
    return { error: 'Failed to create timeline event' };
  }
  
  revalidatePath('/board');
  redirect(`/post/${post.id}`);
}
```

## Data Models

### Post State Management

The `posts` table maintains the current state of each TSR. When any field is updated:
1. The old value is captured
2. A `FIELD_CHANGED` timeline event is created with old and new values
3. The `posts` record is updated with the new value
4. The `updated_at` timestamp is refreshed

This dual-storage approach provides:
- Fast queries for current state (no need to replay events)
- Complete audit trail (all historical values preserved)
- Ability to reconstruct any past state

### Timeline Event Types

**POST_CREATED**
- Created when a new TSR is submitted
- Contains the initial comment in the `body` field
- Marks the beginning of the timeline

**FIELD_CHANGED**
- Created whenever a Post field is modified
- Stores `field_name`, `old_value`, and `new_value`
- Multiple events created if multiple fields change simultaneously
- Field names: "Identifier", "TSR Number", "Response Due", "End A", "End Z", "Data Rate Required"

**COMMENT**
- Created when a user adds a comment
- Contains comment text in the `body` field
- Does not modify Post fields

### Timeline Display Logic

Timeline events are fetched with:
```sql
SELECT 
  te.*,
  p.full_name as author_name
FROM timeline_events te
LEFT JOIN profiles p ON te.created_by = p.id
WHERE te.post_id = $1
ORDER BY te.created_at DESC
```

Rendering logic:
- Events displayed in reverse chronological order (newest first)
- Each event shows timestamp and author
- Event-specific rendering:
  - POST_CREATED: "TSR created" badge + body text
  - FIELD_CHANGED: Field name with old → new value comparison
  - COMMENT: Comment body with visual distinction

## Error Handling

### Validation Errors
- Client-side: Zod validation in forms with inline error messages
- Server-side: Zod validation in server actions with structured error responses
- Display: Use shadcn/ui form error components for field-level errors

### Database Errors
- Guard clauses in server actions check for null/undefined results
- Return structured error objects: `{ error: string }`
- Display: Toast notifications for system-level errors

### Authentication Errors
- Middleware redirects unauthenticated users to login
- Server actions return early with "Unauthorized" error
- Display: Redirect to auth page or show error toast

### Not Found Errors
- Check if post exists before rendering detail page
- Return Next.js `notFound()` for invalid post IDs
- Display: Next.js 404 page

### Error Response Pattern
```typescript
type ActionResult<T> = 
  | { data: T; error?: never }
  | { data?: never; error: string | Record<string, string[]> };
```

## Testing Strategy

### Unit Tests
- Zod schema validation (valid and invalid inputs)
- Date formatting utilities
- Type guards and helper functions

### Integration Tests
- Server actions with mocked Supabase client
- Test create post flow (post + timeline event creation)
- Test update post flow (field changes + timeline events)
- Test comment addition

### End-to-End Tests (Optional)
- Full user flows using Playwright or Cypress
- Create TSR → View on board → Add comment → Edit fields
- Verify timeline displays correctly
- Test mobile responsive behavior

### Manual Testing Checklist
- Create TSR with all required fields
- Create TSR with validation errors
- View board with multiple TSRs
- View post detail and timeline
- Add comments and verify they appear at top
- Edit fields and verify FIELD_CHANGED events
- Test on mobile device/viewport
- Test authentication flow

## Security Considerations

### Row Level Security (RLS)

For development, RLS can be disabled. For production:

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for posts
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update all posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for timeline_events
CREATE POLICY "Authenticated users can view all timeline events"
  ON timeline_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create timeline events"
  ON timeline_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Policies for profiles
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);
```

### Input Sanitization
- All user input validated with Zod before database operations
- SQL injection prevented by Supabase parameterized queries
- XSS prevention through React's automatic escaping

### Authentication
- All routes protected by Supabase Auth middleware
- Server actions verify user authentication before operations
- User ID automatically captured from auth session

## Performance Considerations

### Database Indexes
- `posts.updated_at` - for board sorting
- `posts.response_due` - for filtering/sorting by due date
- `timeline_events.post_id + created_at` - for timeline queries
- Composite index enables efficient DESC ordering

### Query Optimization
- Use `select()` to fetch only needed columns
- Limit board queries if dataset grows large (pagination)
- Timeline events fetched with single query including author join

### Caching Strategy
- Server Components cache by default
- Use `revalidatePath()` after mutations to refresh data
- Consider `unstable_cache` for board page if needed

### Bundle Size
- Tree-shake unused shadcn/ui components
- Use dynamic imports for heavy client components if needed
- Optimize Tailwind CSS with purge configuration
