import { createClient } from '@/lib/supabase/server';
import { Post, TimelineEvent } from '@/lib/utils/types';
import { EditTsrWrapper } from '@/components/edit-tsr-wrapper';
import { TsrTimeline } from '@/components/tsr-timeline';
import { AddCommentWrapper } from '@/components/add-comment-wrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = createClient();

  // Fetch post data
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (postError || !post) {
    notFound();
  }

  // Fetch timeline events with author information
  const { data: timelineEvents, error: timelineError } = await supabase
    .from('timeline_events')
    .select(`
      *,
      author:profiles(full_name)
    `)
    .eq('post_id', params.id)
    .order('created_at', { ascending: false });

  if (timelineError) {
    console.error('Error fetching timeline events:', timelineError);
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/board">← Back to Board</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <EditTsrWrapper post={post as Post} />
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Comment</h2>
          <AddCommentWrapper postId={params.id} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Timeline</h2>
          <TsrTimeline events={(timelineEvents as TimelineEvent[]) || []} />
        </div>
      </div>
    </div>
  );
}
