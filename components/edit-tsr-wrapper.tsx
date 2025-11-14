'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/utils/types';
import { TsrSummaryCard } from '@/components/tsr-summary-card';
import { EditTsrForm } from '@/components/edit-tsr-form';
import { updatePost } from '@/lib/actions/update-post';
import { UpdatePostInput } from '@/lib/validation/schemas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface EditTsrWrapperProps {
  post: Post;
}

export function EditTsrWrapper({ post }: EditTsrWrapperProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: UpdatePostInput) => {
    try {
      const result = await updatePost(data);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'TSR updated successfully',
        });
        setIsEditOpen(false);
        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : 'Failed to update TSR';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <TsrSummaryCard post={post} onEdit={() => setIsEditOpen(true)} />
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit TSR</DialogTitle>
          </DialogHeader>
          <EditTsrForm
            post={post}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
