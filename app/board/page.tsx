import { createClient } from '@/lib/supabase/server';
import { Post } from '@/lib/utils/types';
import { TsrTable } from '@/components/tsr-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function BoardPage() {
  const supabase = createClient();

  // Fetch all posts sorted by updated_at DESC
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="container mx-auto py-8">
        <p className="text-destructive">Failed to load TSRs. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TSR Board</h1>
        <Button asChild>
          <Link href="/new">New TSR</Link>
        </Button>
      </div>
      
      <TsrTable posts={posts as Post[] || []} />
    </div>
  );
}
