import { useQuery } from '@tanstack/react-query';
import { galleryService } from '@/domains/media/services/GalleryService';

const fetchGalleryPhotos = async () => {
  return await galleryService.getHomepageGalleryPhotos(6);
};

export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery', 'public'],
    queryFn: fetchGalleryPhotos,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};