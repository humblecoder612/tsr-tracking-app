/**
 * Helper functions for timeline event rendering
 */

import { TimelineEvent } from './types';

/**
 * Gets the author name from a timeline event, with fallback for unknown users
 * @param event - Timeline event with optional author information
 * @returns Author's full name or "Unknown User" if not available
 */
export function getAuthorName(event: TimelineEvent): string {
  return event.author?.full_name || 'Unknown User';
}

/**
 * Gets the display label for a timeline event type
 * @param eventType - Type of timeline event
 * @returns Human-readable label for the event type
 */
export function getEventTypeLabel(eventType: TimelineEvent['event_type']): string {
  switch (eventType) {
    case 'POST_CREATED':
      return 'Created';
    case 'FIELD_CHANGED':
      return 'Updated';
    case 'COMMENT':
      return 'Comment';
    default:
      return 'Event';
  }
}

/**
 * Gets the badge color classes for a timeline event type
 * @param eventType - Type of timeline event
 * @returns Tailwind CSS classes for badge styling
 */
export function getEventTypeBadgeClasses(eventType: TimelineEvent['event_type']): string {
  switch (eventType) {
    case 'POST_CREATED':
      return 'bg-green-100 text-green-800';
    case 'FIELD_CHANGED':
      return 'bg-blue-100 text-blue-800';
    case 'COMMENT':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Checks if a timeline event has a body/comment
 * @param event - Timeline event
 * @returns True if the event has a body field with content
 */
export function hasEventBody(event: TimelineEvent): boolean {
  return Boolean(event.body && event.body.trim().length > 0);
}

/**
 * Checks if a timeline event is a field change event
 * @param event - Timeline event
 * @returns True if the event is a FIELD_CHANGED type
 */
export function isFieldChangeEvent(event: TimelineEvent): boolean {
  return event.event_type === 'FIELD_CHANGED';
}

/**
 * Formats a field change for display
 * @param event - Timeline event of type FIELD_CHANGED
 * @returns Object with formatted field change information
 */
export function formatFieldChange(event: TimelineEvent): {
  fieldName: string;
  oldValue: string;
  newValue: string;
} | null {
  if (!isFieldChangeEvent(event)) {
    return null;
  }

  return {
    fieldName: event.field_name || 'Unknown Field',
    oldValue: event.old_value || '',
    newValue: event.new_value || '',
  };
}
