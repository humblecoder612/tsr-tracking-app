'use client';

import { AddCommentForm } from '@/components/add-comment-form';
import { addComment } from '@/lib/actions/add-comment';
import { AddCommentInput } from '@/lib/validation/schemas';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AddCommentWrapperProps {
  postId: string;
}

export function AddCommentWrapper({ postId }: AddCommentWrapperProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: AddCommentInput) => {
    setError(null);
    const result = await addComment(data);
    
    if (result?.error) {
      if (typeof result.error === 'string') {
        setError(result.error);
      } else {
        setError('Failed to add comment. Please check your input.');
      }
      throw new Error('Failed to add comment');
    }
    
    router.refresh();
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      <AddCommentForm postId={postId} onSubmit={handleSubmit} />
    </div>
  );
}
