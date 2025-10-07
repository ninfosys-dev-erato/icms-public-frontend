import { publicApiClient } from '@/repositories/http/PublicApiClient';
import { NewsResponse } from '../types/news';

export class NewsService {
  async getNews(): Promise<NewsResponse> {
    try {
      const response = await publicApiClient.get('/content/category/news');
      return response as NewsResponse;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
}

export const newsService = new NewsService();