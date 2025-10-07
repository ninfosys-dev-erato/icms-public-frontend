import type { IServiceRepository, SearchQuery } from "@/repositories/types";
import type { Service, ServiceFilter, ServiceListResponse, ServiceCategory, ServiceStats } from "@/models/service";
import { getJSON, setJSON, setWithTags, invalidateByTags, generateCacheKey } from "@/lib/bff/cache";
import { convertNepaliNumeralsToLatin } from "@/lib/calendars/bs";
// Server-side only import
// import { revalidateTag } from "next/cache";

export class ServiceService {
  constructor(private repository: IServiceRepository) {}

  async getList(params: ServiceFilter): Promise<ServiceListResponse> {
    const cacheKey = generateCacheKey("service:list", params);
    
    const cached = await getJSON<ServiceListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.repository.list(params);
    
    const processedResponse = {
      ...response,
      items: response.items.map(service => this.enrichService(service)),
    };

    const tags = ["services", `office:${params.office || "all"}`, `category:${params.category || "all"}`];
    await setWithTags(cacheKey, processedResponse, 300, tags);

    return processedResponse;
  }

  async getDetail(slug: string): Promise<Service | null> {
    const cacheKey = `service:detail:${slug}`;
    
    const cached = await getJSON<Service>(cacheKey);
    if (cached) {
      this.incrementViewCount(cached.id).catch(console.error);
      return cached;
    }

    const service = await this.repository.getBySlug(slug);
    if (!service) return null;

    const enrichedService = this.enrichService(service);
    await setWithTags(cacheKey, enrichedService, 600, [`service:${service.id}`, "services"]);

    this.incrementViewCount(service.id).catch(console.error);

    return enrichedService;
  }

  async getById(id: string): Promise<Service | null> {
    const cacheKey = `service:id:${id}`;
    
    const cached = await getJSON<Service>(cacheKey);
    if (cached) return cached;

    const service = await this.repository.getById(id);
    if (!service) return null;

    const enrichedService = this.enrichService(service);
    await setWithTags(cacheKey, enrichedService, 600, [`service:${id}`, "services"]);

    return enrichedService;
  }

  async search(query: string, filters?: Partial<ServiceFilter>): Promise<any> {
    const searchQuery: SearchQuery = {
      q: convertNepaliNumeralsToLatin(query.trim()),
      filters: {
        isActive: true,
        ...filters,
      },
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 20,
      sortBy: filters?.sortBy || "priority",
      sortOrder: filters?.sortOrder || "desc",
    };

    const cacheKey = generateCacheKey("service:search", searchQuery);
    
    const cached = await getJSON(cacheKey);
    if (cached) return cached;

    const results = await this.repository.search(searchQuery);
    
    const processedResults = {
      ...results,
      items: results.items.map(service => this.enrichService(service)),
    };

    await setWithTags(cacheKey, processedResults, 180, ["services", "search"]);

    return processedResults;
  }

  async getCategories(): Promise<ServiceCategory[]> {
    const cacheKey = "service:categories";
    
    const cached = await getJSON<ServiceCategory[]>(cacheKey);
    if (cached) return cached;

    const categories = await this.repository.getCategories();
    await setWithTags(cacheKey, categories, 1800, ["services", "categories"]); // 30 minutes

    return categories;
  }

  async getStats(): Promise<ServiceStats> {
    const cacheKey = "service:stats";
    
    const cached = await getJSON<ServiceStats>(cacheKey);
    if (cached) return cached;

    const stats = await this.repository.getStats();
    await setWithTags(cacheKey, stats, 300, ["services", "stats"]);

    return stats;
  }

  async getByCategory(category: string, params?: Partial<ServiceFilter>): Promise<Service[]> {
    const cacheKey = generateCacheKey(`service:category:${category}`, params || {});
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getByCategory(category, params);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 300, ["services", `category:${category}`]);

    return enrichedServices;
  }

  async getByOffice(officeId: string, params?: Partial<ServiceFilter>): Promise<Service[]> {
    const cacheKey = generateCacheKey(`service:office:${officeId}`, params || {});
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getByOffice(officeId, params);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 300, ["services", `office:${officeId}`]);

    return enrichedServices;
  }

  async getPopular(limit = 10): Promise<Service[]> {
    const cacheKey = `service:popular:${limit}`;
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getPopular(limit);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 300, ["services", "popular"]);

    return enrichedServices;
  }

  async getOnlineServices(params?: Partial<ServiceFilter>): Promise<Service[]> {
    const cacheKey = generateCacheKey("service:online", params || {});
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getOnlineServices(params);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 300, ["services", "online"]);

    return enrichedServices;
  }

  async getFreeServices(params?: Partial<ServiceFilter>): Promise<Service[]> {
    const cacheKey = generateCacheKey("service:free", params || {});
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getFreeServices(params);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 300, ["services", "free"]);

    return enrichedServices;
  }

  async getTopRated(limit = 10): Promise<Service[]> {
    const cacheKey = `service:top-rated:${limit}`;
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getTopRated(limit);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 300, ["services", "top-rated"]);

    return enrichedServices;
  }

  async getRelated(id: string, limit = 5): Promise<Service[]> {
    const cacheKey = `service:related:${id}:${limit}`;
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const services = await this.repository.getRelated(id, limit);
    const enrichedServices = services.map(service => this.enrichService(service));

    await setWithTags(cacheKey, enrichedServices, 600, [`service:${id}`, "services"]);

    return enrichedServices;
  }

  async submitRating(id: string, rating: number, comment?: string): Promise<void> {
    await this.repository.submitRating(id, rating, comment);
    
    // Invalidate related caches
    await this.invalidateCache([`service:${id}`, "top-rated", "stats"]);
  }

  async incrementUsageCount(id: string): Promise<void> {
    try {
      await this.repository.incrementUsage(id);
      await this.invalidateCache([`service:${id}`, "popular", "stats"]);
    } catch (error) {
      console.error("Failed to increment usage count:", error);
    }
  }

  async invalidateCache(tags: string[] = ["services"]): Promise<void> {
    await invalidateByTags(tags);
    
    tags.forEach(tag => {
      revalidateTag(tag);
    });
  }

  private enrichService(service: Service): Service {
    const enriched = {
      ...service,
      hasRequirements: service.requirements.length > 0,
      hasDocuments: service.documents.length > 0,
      hasAttachments: service.attachments.length > 0,
      isPopular: service.usageCount > 100,
      isHighlyRated: (service.rating || 0) >= 4.0,
      processingTimeInDays: this.parseProcessingTime(service.processingTime),
      feeFormatted: this.formatFee(service.fee, service.feeCurrency),
    };

    return enriched;
  }

  private parseProcessingTime(processingTime?: string): number | null {
    if (!processingTime) return null;
    
    // Extract number of days from processing time string
    const match = processingTime.match(/(\d+).*day/i);
    return match ? parseInt(match[1], 10) : null;
  }

  private formatFee(fee?: number, currency = "NPR"): string {
    if (!fee || fee === 0) return "Free";
    
    if (currency === "NPR") {
      return `Rs. ${fee.toLocaleString()}`;
    }
    
    return `${currency} ${fee.toLocaleString()}`;
  }

  private async incrementViewCount(id: string): Promise<void> {
    try {
      await this.repository.incrementView(id);
      await this.invalidateCache([`service:${id}`, "popular", "stats"]);
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  }

  // Business logic methods
  async getServicesByProcessingTime(maxDays: number): Promise<Service[]> {
    const allServices = await this.getList({ 
      page: 1, 
      pageSize: 1000,
      isActive: true,
    });

    return allServices.items.filter(service => {
      const days = this.parseProcessingTime(service.processingTime);
      return days !== null && days <= maxDays;
    });
  }

  async getServicesByFeeRange(minFee: number, maxFee: number): Promise<Service[]> {
    const params: ServiceFilter = {
      feeMin: minFee,
      feeMax: maxFee,
      isActive: true,
      page: 1,
      pageSize: 1000,
    };

    const response = await this.getList(params);
    return response.items;
  }

  async getQuickServices(): Promise<Service[]> {
    // Services that can be completed in 1 day or are online
    const cacheKey = "service:quick";
    
    const cached = await getJSON<Service[]>(cacheKey);
    if (cached) return cached;

    const allServices = await this.getList({ 
      page: 1, 
      pageSize: 1000,
      isActive: true,
    });

    const quickServices = allServices.items.filter(service => {
      return service.isOnline || this.parseProcessingTime(service.processingTime) === 1;
    });

    await setWithTags(cacheKey, quickServices, 300, ["services", "quick"]);

    return quickServices;
  }
}