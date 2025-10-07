import { useQuery } from '@tanstack/react-query';

// Minimal test hook with no external dependencies
export function useMinimalTest() {
  return useQuery({
    queryKey: ['minimal-test'],
    queryFn: () => Promise.resolve({ message: 'TanStack Query is working!', timestamp: Date.now() }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}