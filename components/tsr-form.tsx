'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, type CreatePostInput } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TsrFormProps {
  onSubmit: (data: CreatePostInput) => Promise<void>;
}

export function TsrForm({ onSubmit }: TsrFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      identifier: '',
      tsrNumber: '',
      responseDue: '',
      endA: '',
      endZ: '',
      dataRateRequired: '',
      comments: '',
    },
  });

  const handleSubmit = async (data: CreatePostInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New TSR</CardTitle>
        <CardDescription>
          Submit a new Technical Service Request
        </CardDescription>
      </CardHeader>
      <CardContent>
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

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional comments..."
                      className="resize-none"
                      rows={4}
                      maxLength={2000}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <p className="text-sm text-muted-foreground">
                      {field.value.length} / 2000 characters
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating...' : 'Create TSR'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
