// TypeScript types for TSR Tracking Application

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
