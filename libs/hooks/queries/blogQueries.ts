import { fetchBlogs } from '@/services/blogServices';
import { useQuery } from '@tanstack/react-query';

export const useFetchBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => fetchBlogs()
    // enabled: !!getUserAuth()
  });
};
