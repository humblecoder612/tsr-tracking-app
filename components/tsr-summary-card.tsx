import { Post } from '@/lib/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface TsrSummaryCardProps {
  post: Post;
  onEdit?: () => void;
}

export function TsrSummaryCard({ post, onEdit }: TsrSummaryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>TSR Details</CardTitle>
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Identifier</label>
            <p className="text-base mt-1">{post.identifier}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">TSR Number</label>
            <p className="text-base mt-1">{post.tsr_number}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Response Due</label>
            <p className="text-base mt-1">{formatDate(post.response_due)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Data Rate Required</label>
            <p className="text-base mt-1">{post.data_rate_required}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">End A</label>
            <p className="text-base mt-1">{post.end_a}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">End Z</label>
            <p className="text-base mt-1">{post.end_z}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created At</label>
            <p className="text-base mt-1">{formatDateTime(post.created_at)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-base mt-1">{formatDateTime(post.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
