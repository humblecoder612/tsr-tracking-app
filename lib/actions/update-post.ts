'use server';

import { createClient } from '@/lib/supabase/server';
import { updatePostSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function updatePost(data: unknown) {
  const supabase = createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please log in to update a TSR.' };
  }

  // Validate input
  const validation = updatePostSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const validatedData = validation.data;

  // Fetch current post values
  const { data: currentPost, error: fetchError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', validatedData.postId)
    .single();

  if (fetchError || !currentPost) {
    console.error('Failed to fetch current post:', fetchError);
    return { error: 'Failed to find TSR. Please try again.' };
  }

  // Map of field names for display in timeline
  const fieldNameMap: Record<string, string> = {
    identifier: 'Identifier',
    tsrNumber: 'TSR Number',
    responseDue: 'Response Due',
    endA: 'End A',
    endZ: 'End Z',
    dataRateRequired: 'Data Rate Required',
  };

  // Map of field names to database column names
  const dbFieldMap: Record<string, string> = {
    identifier: 'identifier',
    tsrNumber: 'tsr_number',
    responseDue: 'response_due',
    endA: 'end_a',
    endZ: 'end_z',
    dataRateRequired: 'data_rate_required',
  };

  // Track changes and create timeline events
  const changedFields: Array<{ field: string; oldValue: string; newValue: string }> = [];
  const updates: Record<string, string> = {};

  // Check each field for changes
  if (validatedData.identifier !== undefined && validatedData.identifier !== currentPost.identifier) {
    changedFields.push({
      field: fieldNameMap.identifier,
      oldValue: currentPost.identifier,
      newValue: validatedData.identifier,
    });
    updates.identifier = validatedData.identifier;
  }

  if (validatedData.tsrNumber !== undefined && validatedData.tsrNumber !== currentPost.tsr_number) {
    changedFields.push({
      field: fieldNameMap.tsrNumber,
      oldValue: currentPost.tsr_number,
      newValue: validatedData.tsrNumber,
    });
    updates.tsr_number = validatedData.tsrNumber;
  }

  if (validatedData.responseDue !== undefined && validatedData.responseDue !== currentPost.response_due) {
    changedFields.push({
      field: fieldNameMap.responseDue,
      oldValue: currentPost.response_due,
      newValue: validatedData.responseDue,
    });
    updates.response_due = validatedData.responseDue;
  }

  if (validatedData.endA !== undefined && validatedData.endA !== currentPost.end_a) {
    changedFields.push({
      field: fieldNameMap.endA,
      oldValue: currentPost.end_a,
      newValue: validatedData.endA,
    });
    updates.end_a = validatedData.endA;
  }

  if (validatedData.endZ !== undefined && validatedData.endZ !== currentPost.end_z) {
    changedFields.push({
      field: fieldNameMap.endZ,
      oldValue: currentPost.end_z,
      newValue: validatedData.endZ,
    });
    updates.end_z = validatedData.endZ;
  }

  if (validatedData.dataRateRequired !== undefined && validatedData.dataRateRequired !== currentPost.data_rate_required) {
    changedFields.push({
      field: fieldNameMap.dataRateRequired,
      oldValue: currentPost.data_rate_required,
      newValue: validatedData.dataRateRequired,
    });
    updates.data_rate_required = validatedData.dataRateRequired;
  }

  // If no changes, return early
  if (changedFields.length === 0) {
    return { success: true, message: 'No changes detected.' };
  }

  // Create FIELD_CHANGED timeline events for each changed field
  const timelineEvents = changedFields.map((change) => ({
    post_id: validatedData.postId,
    event_type: 'FIELD_CHANGED' as const,
    field_name: change.field,
    old_value: change.oldValue,
    new_value: change.newValue,
    created_by: user.id,
  }));

  const { error: timelineError } = await supabase
    .from('timeline_events')
    .insert(timelineEvents);

  if (timelineError) {
    console.error('Failed to create timeline events:', timelineError);
    return { error: 'Failed to record changes. Please try again.' };
  }

  // Update posts table with new values and updated_at timestamp
  updates.updated_at = new Date().toISOString();

  const { error: updateError } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', validatedData.postId);

  if (updateError) {
    console.error('Failed to update post:', updateError);
    return { error: 'Failed to update TSR. Please try again.' };
  }

  // Revalidate post detail page
  revalidatePath(`/post/${validatedData.postId}`);
  revalidatePath('/board');

  return { success: true, message: 'TSR updated successfully.' };
}
