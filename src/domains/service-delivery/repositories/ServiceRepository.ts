import { AdminApiClient } from "@/repositories/http/AdminApiClient";
import { IServiceRepository, SearchQuery, SearchResult } from "./types";
import { Service, ServiceFilter, ServiceListResponse, ServiceCategory, ServiceStats } from "@/models/service";
import { z } from "zod";

export class ServiceRepository implements IServiceRepository {
  constructor(private api = new AdminApiClient()) {}

  async list(params: ServiceFilter): Promise<ServiceListResponse> {
    const queryString = this.api.buildQueryString(params);
    const data = await this.api.get(`/services?${queryString}`);
    return ServiceListResponse.parse(data);
  }

  async getBySlug(slug: string): Promise<Service | null> {
    try {
      const data = await this.api.get(`/services/slug/${encodeURIComponent(slug)}`);
      return Service.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async getById(id: string): Promise<Service | null> {
    try {
      const data = await this.api.get(`/services/${encodeURIComponent(id)}`);
      return Service.parse(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  async search(query: SearchQuery): Promise<SearchResult<Service>> {
    const data = await this.api.post("/services/search", query);
    
    const SearchResultSchema = z.object({
      items: z.array(Service),
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

  async getCategories(): Promise<ServiceCategory[]> {
    const data = await this.api.get("/services/categories");
    
    const CategoriesSchema = z.object({
      items: z.array(ServiceCategory),
    });
    
    const parsed = CategoriesSchema.parse(data);
    return parsed.items;
  }

  async getStats(): Promise<ServiceStats> {
    const data = await this.api.get("/services/stats");
    return ServiceStats.parse(data);
  }

  async incrementView(id: string): Promise<void> {
    await this.api.post(`/services/${encodeURIComponent(id)}/view`);
  }

  async incrementUsage(id: string): Promise<void> {
    await this.api.post(`/services/${encodeURIComponent(id)}/usage`);
  }

  async submitRating(id: string, rating: number, comment?: string): Promise<void> {
    await this.api.post(`/services/${encodeURIComponent(id)}/rating`, {
      rating,
      comment,
    });
  }

  async getByCategory(category: string, params?: Partial<ServiceFilter>): Promise<Service[]> {
    const allParams = { ...params, category };
    const queryString = this.api.buildQueryString(allParams);
    const data = await this.api.get(`/services/category/${encodeURIComponent(category)}?${queryString}`);
    
    const CategorySchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = CategorySchema.parse(data);
    return parsed.items;
  }

  async getByOffice(officeId: string, params?: Partial<ServiceFilter>): Promise<Service[]> {
    const allParams = { ...params, office: officeId };
    const queryString = this.api.buildQueryString(allParams);
    const data = await this.api.get(`/services/office/${encodeURIComponent(officeId)}?${queryString}`);
    
    const OfficeSchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = OfficeSchema.parse(data);
    return parsed.items;
  }

  async getPopular(limit = 10): Promise<Service[]> {
    const data = await this.api.get(`/services/popular?limit=${limit}`);
    
    const PopularSchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = PopularSchema.parse(data);
    return parsed.items;
  }

  async getOnlineServices(params?: Partial<ServiceFilter>): Promise<Service[]> {
    const allParams = { ...params, isOnline: true };
    const queryString = this.api.buildQueryString(allParams);
    const data = await this.api.get(`/services/online?${queryString}`);
    
    const OnlineSchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = OnlineSchema.parse(data);
    return parsed.items;
  }

  async getFreeServices(params?: Partial<ServiceFilter>): Promise<Service[]> {
    const allParams = { ...params, isFree: true };
    const queryString = this.api.buildQueryString(allParams);
    const data = await this.api.get(`/services/free?${queryString}`);
    
    const FreeSchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = FreeSchema.parse(data);
    return parsed.items;
  }

  async getTopRated(limit = 10): Promise<Service[]> {
    const data = await this.api.get(`/services/top-rated?limit=${limit}`);
    
    const TopRatedSchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = TopRatedSchema.parse(data);
    return parsed.items;
  }

  async getRelated(id: string, limit = 5): Promise<Service[]> {
    const data = await this.api.get(`/services/${encodeURIComponent(id)}/related?limit=${limit}`);
    
    const RelatedSchema = z.object({
      items: z.array(Service),
    });
    
    const parsed = RelatedSchema.parse(data);
    return parsed.items;
  }
}