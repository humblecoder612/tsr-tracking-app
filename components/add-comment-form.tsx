'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCommentSchema, type AddCommentInput } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AddCommentFormProps {
  postId: string;
  onSubmit: (data: AddCommentInput) => Promise<void>;
}

export function AddCommentForm({ postId, onSubmit }: AddCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddCommentInput>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      postId,
      body: '',
    },
  });

  const handleSubmit = async (data: AddCommentInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset({ postId, body: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentBody = form.watch('body');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a comment..."
                  className="resize-none"
                  rows={4}
                  maxLength={2000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                {commentBody?.length || 0} / 2000 characters
              </p>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
        </Button>
      </form>
    </Form>
  );
}
