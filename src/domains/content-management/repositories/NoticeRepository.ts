import { AdminApiClient } from "@/repositories/http/AdminApiClient";
import { INoticeRepository, SearchQuery, SearchResult } from "./types";
import { Notice, NoticeFilter, NoticeListResponse, NoticeStats } from "@/models/notice";
import { z } from "zod";

export class NoticeRepository implements INoticeRepository {
  constructor(private api = new AdminApiClient()) {}

  async list(params: NoticeFilter): Promise<NoticeListResponse> {
    const queryString = this.api.buildQueryString(params);
    const data = await this.api.get(`/notices?${queryString}`);
    return NoticeListResponse.parse(data);
  }

  async getBySlug(slug: string): Promise<Notice | null> {
    try {
      const data = await this.api.get(`/notices/slug/${encodeURIComponent(slug)}`);
      return Notice.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async getById(id: string): Promise<Notice | null> {
    try {
      const data = await this.api.get(`/notices/${encodeURIComponent(id)}`);
      return Notice.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async search(query: SearchQuery): Promise<SearchResult<Notice>> {
    const data = await this.api.post("/notices/search", query);
    
    const SearchResultSchema = z.object({
      items: z.array(Notice),
      total: z.number().int().nonnegative(),
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
      query: z.string(),
      suggestions: z.array(z.string()).optional(),
      facets: z.record(z.array(z.object({
        value: z.string(),
        count: z.number().int().nonnegative(),
      }))).optional(),
    });

    return SearchResultSchema.parse(data);
  }

  async getArchive(yearBS: string, monthBS?: string): Promise<Notice[]> {
    const params: Record<string, any> = { yearBS };
    if (monthBS) {
      params.monthBS = monthBS;
    }
    
    const queryString = this.api.buildQueryString(params);
    const data = await this.api.get(`/notices/archive?${queryString}`);
    
    const ArchiveSchema = z.object({
      items: z.array(Notice),
    });
    
    const parsed = ArchiveSchema.parse(data);
    return parsed.items;
  }

  async getStats(): Promise<NoticeStats> {
    const data = await this.api.get("/notices/stats");
    return NoticeStats.parse(data);
  }

  async incrementView(id: string): Promise<void> {
    await this.api.post(`/notices/${encodeURIComponent(id)}/view`);
  }

  async incrementDownload(id: string): Promise<void> {
    await this.api.post(`/notices/${encodeURIComponent(id)}/download`);
  }

  async getRelated(id: string, limit = 5): Promise<Notice[]> {
    const data = await this.api.get(`/notices/${encodeURIComponent(id)}/related?limit=${limit}`);
    
    const RelatedSchema = z.object({
      items: z.array(Notice),
    });
    
    const parsed = RelatedSchema.parse(data);
    return parsed.items;
  }

  async getByCategory(category: string, params?: Partial<NoticeFilter>): Promise<Notice[]> {
    const allParams = { ...params, category };
    const queryString = this.api.buildQueryString(allParams);
    const data = await this.api.get(`/notices/category/${encodeURIComponent(category)}?${queryString}`);
    
    const CategorySchema = z.object({
      items: z.array(Notice),
    });
    
    const parsed = CategorySchema.parse(data);
    return parsed.items;
  }

  async getByOffice(officeId: string, params?: Partial<NoticeFilter>): Promise<Notice[]> {
    const allParams = { ...params, office: officeId };
    const queryString = this.api.buildQueryString(allParams);
    const data = await this.api.get(`/notices/office/${encodeURIComponent(officeId)}?${queryString}`);
    
    const OfficeSchema = z.object({
      items: z.array(Notice),
    });
    
    const parsed = OfficeSchema.parse(data);
    return parsed.items;
  }

  async getPopular(limit = 10): Promise<Notice[]> {
    const data = await this.api.get(`/notices/popular?limit=${limit}`);
    
    const PopularSchema = z.object({
      items: z.array(Notice),
    });
    
    const parsed = PopularSchema.parse(data);
    return parsed.items;
  }

  async getRecent(limit = 10): Promise<Notice[]> {
    const data = await this.api.get(`/notices/recent?limit=${limit}`);
    
    const RecentSchema = z.object({
      items: z.array(Notice),
    });
    
    const parsed = RecentSchema.parse(data);
    return parsed.items;
  }
}

// Export singleton instance
export const noticeRepository = new NoticeRepository()