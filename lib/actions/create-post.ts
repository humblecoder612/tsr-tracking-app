'use server';

import { createClient } from '@/lib/supabase/server';
import { createPostSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(data: unknown) {
  const supabase = createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized. Please log in to create a TSR.' };
  }

  // Validate input
  const validation = createPostSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const validatedData = validation.data;

  // Insert post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      identifier: validatedData.identifier,
      tsr_number: validatedData.tsrNumber,
      response_due: validatedData.responseDue,
      end_a: validatedData.endA,
      end_z: validatedData.endZ,
      data_rate_required: validatedData.dataRateRequired,
      created_by: user.id,
    })
    .select()
    .single();

  if (postError || !post) {
    console.error('Failed to create post:', postError);
    return { error: 'Failed to create TSR. Please try again.' };
  }

  // Create initial timeline event
  const { error: timelineError } = await supabase.from('timeline_events').insert({
    post_id: post.id,
    event_type: 'POST_CREATED',
    body: validatedData.comments || 'TSR created',
    created_by: user.id,
  });

  if (timelineError) {
    console.error('Failed to create timeline event:', timelineError);
    return { error: 'TSR created but failed to create timeline event.' };
  }

  revalidatePath('/board');
  redirect(`/post/${post.id}`);
}
