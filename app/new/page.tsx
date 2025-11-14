import { TsrForm } from '@/components/tsr-form';
import { createPost } from '@/lib/actions/create-post';
import { CreatePostInput } from '@/lib/validation/schemas';

export default function NewTsrPage() {
  async function handleSubmit(data: CreatePostInput) {
    'use server';
    await createPost(data);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TsrForm onSubmit={handleSubmit} />
    </div>
  );
}
