import type { INoticeRepository, SearchQuery } from "@/repositories/types";
import type { Notice, NoticeFilter, NoticeListResponse, NoticeStats } from "@/models/notice";
import { getJSON, setJSON, setWithTags, invalidateByTags, generateCacheKey } from "@/lib/bff/cache";
import { parseBSDate, formatBSDate, getCurrentBSDate, convertNepaliNumeralsToLatin } from "@/lib/calendars/bs";
// Server-side only import
// import { revalidateTag } from "next/cache";

export class NoticeService {
  constructor(private repository: INoticeRepository) {}

  async getList(params: NoticeFilter): Promise<NoticeListResponse> {
    // Generate cache key based on parameters
    const cacheKey = generateCacheKey("notice:list", params);
    
    // Try to get from cache first
    const cached = await getJSON<NoticeListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from repository
    const response = await this.repository.list(params);
    
    // Process notices (convert dates, etc.)
    const processedResponse = {
      ...response,
      items: response.items.map(notice => this.enrichNotice(notice)),
    };

    // Cache the result with tags for invalidation
    const tags = ["notices", `office:${params.office || "all"}`, `type:${params.type || "all"}`];
    await setWithTags(cacheKey, processedResponse, 300, tags); // 5 minutes

    return processedResponse;
  }

  async getDetail(slug: string): Promise<Notice | null> {
    const cacheKey = `notice:detail:${slug}`;
    
    // Try cache first
    const cached = await getJSON<Notice>(cacheKey);
    if (cached) {
      // Increment view count in background
      this.incrementViewCount(cached.id).catch(console.error);
      return cached;
    }

    // Fetch from repository
    const notice = await this.repository.getBySlug(slug);
    if (!notice) return null;

    // Process and enrich notice
    const enrichedNotice = this.enrichNotice(notice);

    // Cache the result
    await setWithTags(cacheKey, enrichedNotice, 600, [`notice:${notice.id}`, "notices"]); // 10 minutes

    // Increment view count in background
    this.incrementViewCount(notice.id).catch(console.error);

    return enrichedNotice;
  }

  async getById(id: string): Promise<Notice | null> {
    const cacheKey = `notice:id:${id}`;
    
    const cached = await getJSON<Notice>(cacheKey);
    if (cached) return cached;

    const notice = await this.repository.getById(id);
    if (!notice) return null;

    const enrichedNotice = this.enrichNotice(notice);
    await setWithTags(cacheKey, enrichedNotice, 600, [`notice:${id}`, "notices"]);

    return enrichedNotice;
  }

  async search(query: string, filters?: Partial<NoticeFilter>): Promise<any> {
    const searchQuery: SearchQuery = {
      q: convertNepaliNumeralsToLatin(query.trim()),
      filters: {
        isActive: true,
        ...filters,
      },
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 20,
      sortBy: filters?.sortBy || "publishedAt",
      sortOrder: filters?.sortOrder || "desc",
    };

    const cacheKey = generateCacheKey("notice:search", searchQuery);
    
    const cached = await getJSON(cacheKey);
    if (cached) return cached;

    const results = await this.repository.search(searchQuery);
    
    // Process search results
    const processedResults = {
      ...results,
      items: results.items.map(notice => this.enrichNotice(notice)),
    };

    await setWithTags(cacheKey, processedResults, 180, ["notices", "search"]); // 3 minutes

    return processedResults;
  }

  async getArchive(yearBS: string, monthBS?: string): Promise<Notice[]> {
    const cacheKey = `notice:archive:${yearBS}:${monthBS || "all"}`;
    
    const cached = await getJSON<Notice[]>(cacheKey);
    if (cached) return cached;

    const notices = await this.repository.getArchive(yearBS, monthBS);
    const enrichedNotices = notices.map(notice => this.enrichNotice(notice));

    await setWithTags(cacheKey, enrichedNotices, 1800, ["notices", "archive"]); // 30 minutes

    return enrichedNotices;
  }

  async getStats(): Promise<NoticeStats> {
    const cacheKey = "notice:stats";
    
    const cached = await getJSON<NoticeStats>(cacheKey);
    if (cached) return cached;

    const stats = await this.repository.getStats();
    await setWithTags(cacheKey, stats, 300, ["notices", "stats"]); // 5 minutes

    return stats;
  }

  async getRelated(id: string, limit = 5): Promise<Notice[]> {
    const cacheKey = `notice:related:${id}:${limit}`;
    
    const cached = await getJSON<Notice[]>(cacheKey);
    if (cached) return cached;

    const notices = await this.repository.getRelated(id, limit);
    const enrichedNotices = notices.map(notice => this.enrichNotice(notice));

    await setWithTags(cacheKey, enrichedNotices, 600, [`notice:${id}`, "notices"]); // 10 minutes

    return enrichedNotices;
  }

  async getPopular(limit = 10): Promise<Notice[]> {
    const cacheKey = `notice:popular:${limit}`;
    
    const cached = await getJSON<Notice[]>(cacheKey);
    if (cached) return cached;

    const notices = await this.repository.getPopular(limit);
    const enrichedNotices = notices.map(notice => this.enrichNotice(notice));

    await setWithTags(cacheKey, enrichedNotices, 300, ["notices", "popular"]); // 5 minutes

    return enrichedNotices;
  }

  async getRecent(limit = 10): Promise<Notice[]> {
    const cacheKey = `notice:recent:${limit}`;
    
    const cached = await getJSON<Notice[]>(cacheKey);
    if (cached) return cached;

    const notices = await this.repository.getRecent(limit);
    const enrichedNotices = notices.map(notice => this.enrichNotice(notice));

    await setWithTags(cacheKey, enrichedNotices, 180, ["notices", "recent"]); // 3 minutes

    return enrichedNotices;
  }

  async getByCategory(category: string, params?: Partial<NoticeFilter>): Promise<Notice[]> {
    const cacheKey = generateCacheKey(`notice:category:${category}`, params || {});
    
    const cached = await getJSON<Notice[]>(cacheKey);
    if (cached) return cached;

    const notices = await this.repository.getByCategory(category, params);
    const enrichedNotices = notices.map(notice => this.enrichNotice(notice));

    await setWithTags(cacheKey, enrichedNotices, 300, ["notices", `category:${category}`]); // 5 minutes

    return enrichedNotices;
  }

  async invalidateCache(tags: string[] = ["notices"]): Promise<void> {
    await invalidateByTags(tags);
    
    // Also invalidate Next.js cache
    tags.forEach(tag => {
      revalidateTag(tag);
    });
  }

  private enrichNotice(notice: Notice): Notice {
    // Parse and format BS date if present
    if (notice.bsDate) {
      const bsDate = parseBSDate(notice.bsDate);
      if (bsDate) {
        notice.bsDate = formatBSDate(bsDate, "english");
      }
    }

    // Add computed fields
    const enriched = {
      ...notice,
      isExpired: notice.expiryDate ? new Date(notice.expiryDate) < new Date() : false,
      isRecent: new Date(notice.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
      hasAttachments: notice.attachments.length > 0,
      estimatedReadTime: this.calculateReadTime(notice.content || notice.summary || ""),
    };

    return enriched;
  }

  private calculateReadTime(content: string): number {
    // Average reading speed: 200 words per minute for Nepali text
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private async incrementViewCount(id: string): Promise<void> {
    try {
      await this.repository.incrementView(id);
      // Invalidate related caches
      await this.invalidateCache([`notice:${id}`, "popular", "stats"]);
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    try {
      await this.repository.incrementDownload(id);
      // Invalidate related caches
      await this.invalidateCache([`notice:${id}`, "stats"]);
    } catch (error) {
      console.error("Failed to increment download count:", error);
    }
  }

  // Business logic methods
  async getUpcomingDeadlines(days = 30): Promise<Notice[]> {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

    const params: NoticeFilter = {
      isActive: true,
      page: 1,
      pageSize: 50,
      sortBy: "expiryDate",
      sortOrder: "asc",
    };

    const response = await this.getList(params);
    
    return response.items.filter(notice => {
      if (!notice.expiryDate) return false;
      const expiryDate = new Date(notice.expiryDate);
      return expiryDate >= currentDate && expiryDate <= futureDate;
    });
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Notice[]> {
    const params: NoticeFilter = {
      dateFrom: startDate,
      dateTo: endDate,
      isActive: true,
      page: 1,
      pageSize: 1000, // Large page size for date range
      sortBy: "publishedAt",
      sortOrder: "desc",
    };

    const response = await this.getList(params);
    return response.items;
  }
}

// Export singleton instance
import { noticeRepository } from '../repositories/NoticeRepository';
export const noticeService = new NoticeService(noticeRepository);