import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useGetNotificationsSummary } from './useQueries';
import { toast } from 'sonner';

const POLLING_INTERVAL = 10000; // 10 seconds

export function useNotificationPolling() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: summary } = useGetNotificationsSummary();
  const previousUnreadRef = useRef<bigint | null>(null);
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      previousUnreadRef.current = null;
      return;
    }

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['notificationsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    if (!summary || !isAuthenticated) return;

    const currentUnread = summary.unread;

    if (previousUnreadRef.current !== null && currentUnread > previousUnreadRef.current) {
      const newCount = Number(currentUnread - previousUnreadRef.current);
      toast.info(`You have ${newCount} new notification${newCount > 1 ? 's' : ''}`, {
        duration: 5000,
      });
    }

    previousUnreadRef.current = currentUnread;
  }, [summary, isAuthenticated]);
}
