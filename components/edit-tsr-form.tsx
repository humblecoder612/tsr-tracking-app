'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePostSchema, type UpdatePostInput } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Post } from '@/lib/utils/types';

interface EditTsrFormProps {
  post: Post;
  onSubmit: (data: UpdatePostInput) => Promise<void>;
  onCancel?: () => void;
}

export function EditTsrForm({ post, onSubmit, onCancel }: EditTsrFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdatePostInput>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      postId: post.id,
      identifier: post.identifier,
      tsrNumber: post.tsr_number,
      responseDue: post.response_due,
      endA: post.end_a,
      endZ: post.end_z,
      dataRateRequired: post.data_rate_required,
    },
  });

  const handleSubmit = async (data: UpdatePostInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Circuit ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tsrNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TSR Number</FormLabel>
                  <FormControl>
                    <Input placeholder="TSR Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responseDue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response Due</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End A</FormLabel>
                  <FormControl>
                    <Input placeholder="End A location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endZ"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Z</FormLabel>
                  <FormControl>
                    <Input placeholder="End Z location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataRateRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Rate Required</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 100 Mbps" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
    </div>
  );
}
