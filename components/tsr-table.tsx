'use client';

import { Post } from '@/lib/utils/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface TsrTableProps {
  posts: Post[];
}

export function TsrTable({ posts }: TsrTableProps) {
  const router = useRouter();

  const handleRowClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No TSRs found. Create your first TSR to get started.
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identifier</TableHead>
              <TableHead>TSR Number</TableHead>
              <TableHead>Response Due</TableHead>
              <TableHead>End A</TableHead>
              <TableHead>End Z</TableHead>
              <TableHead>Data Rate Required</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                onClick={() => handleRowClick(post.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{post.identifier}</TableCell>
                <TableCell>{post.tsr_number}</TableCell>
                <TableCell>{formatDate(post.response_due)}</TableCell>
                <TableCell>{post.end_a}</TableCell>
                <TableCell>{post.end_z}</TableCell>
                <TableCell>{post.data_rate_required}</TableCell>
                <TableCell>{formatDateTime(post.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            onClick={() => handleRowClick(post.id)}
            className="cursor-pointer hover:bg-muted/50 transition-colors active:bg-muted"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{post.identifier}</CardTitle>
              <p className="text-sm text-muted-foreground">
                TSR: {post.tsr_number}
              </p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Due:</span>
                <span className="font-medium">{formatDate(post.response_due)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End A:</span>
                <span>{post.end_a}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Z:</span>
                <span>{post.end_z}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Rate:</span>
                <span>{post.data_rate_required}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-xs">{formatDateTime(post.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
