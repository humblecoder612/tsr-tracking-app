# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize Next.js project with TypeScript and App Router
  - Install and configure Tailwind CSS
  - Install Supabase client libraries (@supabase/supabase-js, @supabase/auth-helpers-nextjs)
  - Install Zod for validation
  - Initialize shadcn/ui and install required components (form, input, button, card, table, textarea)
  - _Requirements: 1.1, 2.1, 3.1, 7.1_

- [x] 2. Configure Supabase and create database schema
  - Set up Supabase project and obtain credentials
  - Create environment variables file with Supabase URL and anon key
  - Create database migration file with profiles, posts, and timeline_events tables
  - Execute migration in Supabase SQL editor
  - Create database indexes for performance optimization
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Implement Supabase client utilities and authentication
  - Create server-side Supabase client in lib/supabase/server.ts
  - Create client-side Supabase client in lib/supabase/client.ts
  - Implement authentication middleware for route protection
  - Configure root layout with Supabase auth provider
  - _Requirements: 7.1, 7.2_

- [x] 4. Create validation schemas and TypeScript types
  - Define TypeScript interfaces for Post, TimelineEvent, and related types in lib/utils/types.ts
  - Create Zod schemas for createPost, addComment, and updatePost in lib/validation/schemas.ts
  - Export TypeScript types inferred from Zod schemas
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 5. Implement TSR creation functionality
- [x] 5.1 Create the /new page and form UI
  - Build app/new/page.tsx with form layout
  - Create components/tsr-form.tsx as client component with all required fields
  - Implement form state management and client-side Zod validation
  - Add error display for validation failures
  - Style form with Tailwind and shadcn/ui components
  - _Requirements: 1.1, 1.4, 8.1, 8.2, 8.3, 8.4, 9.1, 9.3_

- [x] 5.2 Implement create post server action
  - Create lib/actions/create-post.ts server action
  - Implement user authentication check
  - Validate form data with Zod schema
  - Insert new post record into posts table
  - Create POST_CREATED timeline event with comments
  - Handle errors with guard clauses and return structured error objects
  - Revalidate /board path and redirect to post detail page
  - _Requirements: 1.2, 1.3, 1.5, 6.2, 6.5, 7.2, 8.3, 8.5_

- [x] 6. Implement board view functionality
- [x] 6.1 Create the /board page
  - Build app/board/page.tsx as Server Component
  - Fetch all posts from Supabase with sorting by updated_at DESC
  - Create components/tsr-table.tsx to display posts in table format
  - Add table columns for Identifier, TSR Number, Response Due, End A, End Z, Data Rate Required, Last Updated
  - Implement row click navigation to post detail page
  - Add "New TSR" button linking to /new
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 7.3_

- [x] 6.2 Implement mobile-responsive table layout
  - Add responsive Tailwind classes to adapt table for mobile screens
  - Implement card or simplified list view for small viewports
  - Ensure touch-friendly interactive elements
  - _Requirements: 2.4, 9.1, 9.2, 9.5_

- [x] 7. Implement post detail and timeline view
- [x] 7.1 Create the /post/[id] page
  - Build app/post/[id]/page.tsx as Server Component
  - Fetch post data and timeline events with author information
  - Handle not found case with Next.js notFound()
  - Create components/tsr-summary-card.tsx to display current post state
  - Display all post fields with labels
  - _Requirements: 3.1, 7.3_

- [x] 7.2 Implement timeline display component
  - Create components/tsr-timeline.tsx to render timeline events
  - Sort timeline events by created_at DESC (newest first)
  - Implement event-specific rendering for POST_CREATED, FIELD_CHANGED, and COMMENT types
  - Display author name and timestamp for each event
  - Style timeline with vertical line, dots, and card-like event bodies using Tailwind
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 6.1, 9.4_

- [x] 8. Implement comment functionality
- [x] 8.1 Create add comment form component
  - Build components/add-comment-form.tsx as client component
  - Add textarea input with character count (max 2000)
  - Implement client-side validation with Zod
  - Add submit button with loading state
  - _Requirements: 4.1, 4.5, 9.3_

- [x] 8.2 Implement add comment server action
  - Create lib/actions/add-comment.ts server action
  - Validate user authentication
  - Validate comment data with Zod schema
  - Insert COMMENT timeline event into timeline_events table
  - Update post updated_at timestamp
  - Revalidate post detail page
  - _Requirements: 4.2, 4.3, 4.4, 6.5, 7.2, 8.5_

- [x] 9. Implement TSR field editing functionality
- [x] 9.1 Create edit TSR form component
  - Build components/edit-tsr-form.tsx as client component
  - Pre-populate form with current post values
  - Add fields for Identifier, TSR Number, Response Due, End A, End Z, Data Rate Required
  - Implement client-side validation with Zod
  - _Requirements: 5.1, 8.1, 8.2, 8.3_

- [x] 9.2 Implement update post server action
  - Create lib/actions/update-post.ts server action
  - Validate user authentication
  - Validate update data with Zod schema
  - Fetch current post values
  - For each changed field, create FIELD_CHANGED timeline event with old and new values
  - Update posts table with new values
  - Update updated_at timestamp
  - Revalidate post detail page
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 6.3, 6.4, 7.2_

- [x] 10. Implement utility functions and helpers
  - Create lib/utils/date-format.ts with date formatting functions
  - Add helper functions for timeline event rendering
  - Implement error message formatting utilities
  - _Requirements: 3.2, 8.5_

- [x] 11. Configure root layout and navigation
  - Set up app/layout.tsx with Supabase auth provider
  - Add global styles and Tailwind configuration
  - Create app/page.tsx to redirect root to /board
  - Implement basic navigation header with auth status
  - _Requirements: 7.1, 9.1_

- [x] 12. Implement Row Level Security policies
  - Create RLS policies for posts table (view all, create own, update all)
  - Create RLS policies for timeline_events table (view all, create own)
  - Create RLS policies for profiles table (view all)
  - Enable RLS on all tables
  - _Requirements: 7.3, 7.4, 7.5_

- [ ]* 13. Add error handling and user feedback
  - Implement toast notifications for success and error messages
  - Add loading states to all forms and buttons
  - Create error boundary components for graceful error handling
  - Add user-friendly error messages for all validation failures
  - _Requirements: 8.5_

- [ ]* 14. Optimize performance
  - Verify database indexes are created correctly
  - Implement revalidatePath calls after all mutations
  - Test query performance with sample data
  - Optimize bundle size by reviewing imports
  - _Requirements: 2.5_

- [ ]* 15. Write unit tests for validation schemas
  - Test createPostSchema with valid and invalid inputs
  - Test addCommentSchema with valid and invalid inputs
  - Test updatePostSchema with valid and invalid inputs
  - Test edge cases (empty strings, max length, invalid dates)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 16. Write integration tests for server actions
  - Test createPost action with mocked Supabase client
  - Test addComment action with mocked Supabase client
  - Test updatePost action with mocked Supabase client
  - Verify timeline events are created correctly
  - _Requirements: 1.2, 1.3, 4.2, 4.3, 5.2, 5.3, 6.3_
