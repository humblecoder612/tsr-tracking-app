'use server';

import { createClient } from '@/lib/supabase/server';
import { addCommentSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function addComment(data: unknown) {
  const supabase = createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please log in to add a comment.' };
  }

  // Validate input
  const validation = addCommentSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const validatedData = validation.data;

  // Insert COMMENT timeline event
  const { error: timelineError } = await supabase.from('timeline_events').insert({
    post_id: validatedData.postId,
    event_type: 'COMMENT',
    body: validatedData.body,
    created_by: user.id,
  });

  if (timelineError) {
    console.error('Failed to create comment:', timelineError);
    return { error: 'Failed to add comment. Please try again.' };
  }

  // Update post updated_at timestamp
  const { error: updateError } = await supabase
    .from('posts')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', validatedData.postId);

  if (updateError) {
    console.error('Failed to update post timestamp:', updateError);
    // Don't return error since comment was created successfully
  }

  // Revalidate post detail page
  revalidatePath(`/post/${validatedData.postId}`);

  return { success: true };
}
