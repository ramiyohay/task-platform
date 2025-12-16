import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import { QUERY_KEYS } from '../constants/app';

// Hook to fetch and return the list of users
export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
  });
}
