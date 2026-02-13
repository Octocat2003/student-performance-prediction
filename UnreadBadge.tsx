import { useGetNotificationsSummary } from '../../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

export default function UnreadBadge() {
  const { data: summary } = useGetNotificationsSummary();

  if (!summary || summary.unread === BigInt(0)) {
    return null;
  }

  return (
    <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1 text-xs">
      {Number(summary.unread)}
    </Badge>
  );
}
