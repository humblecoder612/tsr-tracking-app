# Database Schema Reference

## Tables

### profiles
Stores user profile information linked to Supabase Auth users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, REFERENCES auth.users(id) | User ID from Supabase Auth |
| full_name | TEXT | - | User's full name |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Profile creation timestamp |

### posts
Stores the current state of each TSR (Technical Service Request).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique post identifier |
| identifier | TEXT | NOT NULL | User-facing TSR identifier (e.g., circuit ID) |
| tsr_number | TEXT | NOT NULL | Official TSR number |
| response_due | DATE | NOT NULL | Response due date |
| end_a | TEXT | NOT NULL | End A location/identifier |
| end_z | TEXT | NOT NULL | End Z location/identifier |
| data_rate_required | TEXT | NOT NULL | Required data rate |
| created_by | UUID | REFERENCES auth.users(id) | User who created the post |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Post creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp (auto-updated) |

**Indexes:**
- `idx_posts_updated_at` on `updated_at DESC` - for board sorting
- `idx_posts_response_due` on `response_due` - for filtering by due date

**Triggers:**
- `update_posts_updated_at` - automatically updates `updated_at` on row update

### timeline_events
Stores the complete audit history of all changes to posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique event identifier |
| post_id | UUID | NOT NULL, REFERENCES posts(id) ON DELETE CASCADE | Associated post |
| event_type | timeline_event_type | NOT NULL | Type of event (see enum below) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Event creation timestamp |
| created_by | UUID | REFERENCES auth.users(id) | User who created the event |
| body | TEXT | - | Comment text (for POST_CREATED and COMMENT) |
| field_name | TEXT | - | Field name (for FIELD_CHANGED) |
| old_value | TEXT | - | Previous value (for FIELD_CHANGED) |
| new_value | TEXT | - | New value (for FIELD_CHANGED) |

**Indexes:**
- `idx_timeline_events_post_id` on `(post_id, created_at DESC)` - for post timeline queries
- `idx_timeline_events_created_at` on `created_at DESC` - for global timeline queries

**Constraints:**
- `valid_post_created` - ensures `body` is NOT NULL when event_type is 'POST_CREATED'
- `valid_field_changed` - ensures `field_name`, `old_value`, and `new_value` are NOT NULL when event_type is 'FIELD_CHANGED'
- `valid_comment` - ensures `body` is NOT NULL when event_type is 'COMMENT'

## Enums

### timeline_event_type
Defines the types of events that can occur in the timeline.

**Values:**
- `POST_CREATED` - Initial TSR creation event
- `FIELD_CHANGED` - A post field was modified
- `COMMENT` - A comment was added to the post

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### posts
- **SELECT**: All authenticated users can view all posts
- **INSERT**: Authenticated users can create posts (must set created_by to their own user ID)
- **UPDATE**: All authenticated users can update all posts

### timeline_events
- **SELECT**: All authenticated users can view all timeline events
- **INSERT**: Authenticated users can create timeline events (must set created_by to their own user ID)

### profiles
- **SELECT**: All authenticated users can view all profiles

## Relationships

```
auth.users (Supabase Auth)
    ↓
    ├─→ profiles (1:1)
    ├─→ posts.created_by (1:many)
    └─→ timeline_events.created_by (1:many)

posts
    ↓
    └─→ timeline_events.post_id (1:many, CASCADE DELETE)
```

## Query Examples

### Get all posts with latest update first
```sql
SELECT * FROM posts
ORDER BY updated_at DESC;
```

### Get post with timeline events and authors
```sql
SELECT 
  p.*,
  json_agg(
    json_build_object(
      'id', te.id,
      'event_type', te.event_type,
      'created_at', te.created_at,
      'body', te.body,
      'field_name', te.field_name,
      'old_value', te.old_value,
      'new_value', te.new_value,
      'author', json_build_object(
        'full_name', pr.full_name
      )
    ) ORDER BY te.created_at DESC
  ) as timeline_events
FROM posts p
LEFT JOIN timeline_events te ON te.post_id = p.id
LEFT JOIN profiles pr ON te.created_by = pr.id
WHERE p.id = $1
GROUP BY p.id;
```

### Get timeline events for a post
```sql
SELECT 
  te.*,
  p.full_name as author_name
FROM timeline_events te
LEFT JOIN profiles p ON te.created_by = p.id
WHERE te.post_id = $1
ORDER BY te.created_at DESC;
```
