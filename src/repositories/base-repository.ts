import { z } from 'zod';

export interface Repository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findMany(filters?: Record<string, unknown>): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: K, updates: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
  count(filters?: Record<string, unknown>): Promise<number>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export abstract class BaseRepository<T, K = string> implements Repository<T, K> {
  protected abstract entitySchema: z.ZodSchema<T>;
  protected abstract endpoint: string;

  protected async request<R>(
    path: string,
    options: RequestInit = {}
  ): Promise<R> {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${this.endpoint}${path}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  protected validateEntity(data: unknown): T {
    return this.entitySchema.parse(data);
  }

  protected validateEntityArray(data: unknown[]): T[] {
    return data.map(item => this.validateEntity(item));
  }

  async findById(id: K): Promise<T | null> {
    try {
      const data = await this.request<T>(`/${id}`);
      return this.validateEntity(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async findMany(filters: Record<string, unknown> = {}): Promise<T[]> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const query = searchParams.toString();
    const path = query ? `?${query}` : '';
    
    const data = await this.request<T[]>(path);
    return this.validateEntityArray(data);
  }

  async findPaginated(
    filters: Record<string, unknown> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const searchParams = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    // Add pagination options
    if (options.page) searchParams.append('page', String(options.page));
    if (options.limit) searchParams.append('limit', String(options.limit));
    if (options.sortBy) searchParams.append('sortBy', options.sortBy);
    if (options.sortOrder) searchParams.append('sortOrder', options.sortOrder);

    const query = searchParams.toString();
    const path = `/paginated${query ? `?${query}` : ''}`;
    
    const result = await this.request<PaginatedResult<unknown>>(path);
    
    return {
      ...result,
      data: this.validateEntityArray(result.data as unknown[]),
    };
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const data = await this.request<T>('', {
      method: 'POST',
      body: JSON.stringify(entity),
    });
    
    return this.validateEntity(data);
  }

  async update(id: K, updates: Partial<T>): Promise<T> {
    const data = await this.request<T>(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    
    return this.validateEntity(data);
  }

  async delete(id: K): Promise<boolean> {
    await this.request(`/${id}`, {
      method: 'DELETE',
    });
    
    return true;
  }

  async count(filters: Record<string, unknown> = {}): Promise<number> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const query = searchParams.toString();
    const path = `/count${query ? `?${query}` : ''}`;
    
    const result = await this.request<{ count: number }>(path);
    return result.count;
  }

  async search(
    query: string,
    options: {
      fields?: string[];
      filters?: Record<string, unknown>;
      pagination?: PaginationOptions;
    } = {}
  ): Promise<PaginatedResult<T>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (options.fields) {
      searchParams.append('fields', options.fields.join(','));
    }
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    if (options.pagination) {
      const { page, limit, sortBy, sortOrder } = options.pagination;
      if (page) searchParams.append('page', String(page));
      if (limit) searchParams.append('limit', String(limit));
      if (sortBy) searchParams.append('sortBy', sortBy);
      if (sortOrder) searchParams.append('sortOrder', sortOrder);
    }

    const result = await this.request<PaginatedResult<unknown>>(`/search?${searchParams.toString()}`);
    
    return {
      ...result,
      data: this.validateEntityArray(result.data as unknown[]),
    };
  }
}