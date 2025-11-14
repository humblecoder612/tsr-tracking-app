import { TimelineEvent } from '@/lib/utils/types';
import { Card, CardContent } from '@/components/ui/card';

interface TsrTimelineProps {
  events: TimelineEvent[];
}

export function TsrTimeline({ events }: TsrTimelineProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAuthorName = (event: TimelineEvent) => {
    return event.author?.full_name || 'Unknown User';
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No timeline events yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-6" />

      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-12 md:pl-16">
            {/* Dot */}
            <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background md:left-4.5" />

            <Card>
              <CardContent className="pt-6">
                {/* Event header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {event.event_type === 'POST_CREATED' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Created
                      </span>
                    )}
                    {event.event_type === 'FIELD_CHANGED' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Updated
                      </span>
                    )}
                    {event.event_type === 'COMMENT' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Comment
                      </span>
                    )}
                    <span className="text-sm font-medium">{getAuthorName(event)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(event.created_at)}
                  </span>
                </div>

                {/* Event content */}
                <div className="text-sm">
                  {event.event_type === 'POST_CREATED' && (
                    <div>
                      <p className="text-muted-foreground mb-2">TSR created</p>
                      {event.body && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="whitespace-pre-wrap">{event.body}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {event.event_type === 'FIELD_CHANGED' && (
                    <div>
                      <p className="font-medium mb-2">{event.field_name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1">
                          <span className="text-xs text-muted-foreground">Old value:</span>
                          <div className="bg-red-50 border border-red-200 p-2 rounded mt-1">
                            <p className="text-red-900">{event.old_value}</p>
                          </div>
                        </div>
                        <div className="hidden sm:block text-muted-foreground">→</div>
                        <div className="flex-1">
                          <span className="text-xs text-muted-foreground">New value:</span>
                          <div className="bg-green-50 border border-green-200 p-2 rounded mt-1">
                            <p className="text-green-900">{event.new_value}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.event_type === 'COMMENT' && event.body && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="whitespace-pre-wrap">{event.body}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
