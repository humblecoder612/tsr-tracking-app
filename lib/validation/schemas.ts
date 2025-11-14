// Zod validation schemas for TSR Tracking Application

import { z } from 'zod';

export const createPostSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required').max(50, 'Identifier must be 50 characters or less'),
  tsrNumber: z.string().min(1, 'TSR Number is required'),
  responseDue: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Response Due must be a valid date',
  }),
  endA: z.string().min(1, 'End A is required'),
  endZ: z.string().min(1, 'End Z is required'),
  dataRateRequired: z.string().min(1, 'Data Rate Required is required'),
  comments: z.string().max(2000, 'Comments must be 2000 characters or less').optional(),
});

export const addCommentSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  body: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment must be 2000 characters or less'),
});

export const updatePostSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  identifier: z.string().min(1).max(50).optional(),
  tsrNumber: z.string().min(1).optional(),
  responseDue: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  endA: z.string().min(1).optional(),
  endZ: z.string().min(1).optional(),
  dataRateRequired: z.string().min(1).optional(),
});

// Export TypeScript types inferred from Zod schemas
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
