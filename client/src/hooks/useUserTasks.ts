import { useQuery } from '@tanstack/react-query';
import { fetchUserTasks } from '../api/tasks';
import { QUERY_KEYS } from '../constants/app';

// Hook to fetch and return tasks for a specific user
export function useUserTasks(userId: number | null) {
  return useQuery({
    queryKey: userId ? QUERY_KEYS.userTasks(userId) : ['userTasks', 'none'],
    enabled: userId !== null,
    queryFn: () => fetchUserTasks(userId as number),
  });
}
