/**
 * HTTP Client for Public API
 * Handles communication with the backend API for public-facing data
 */

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  message?: string
  error?: string
}

export class PublicApiClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor() {
    // Detect if we're running in browser or server
    const isClient = typeof window !== 'undefined';
    
    // Use environment variable for API base URL, fallback to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
    
    console.log('🌐 PublicApiClient initialized with base URL:', this.baseUrl);
    console.log('🌐 Environment variables:', {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      API_BASE_URL: process.env.API_BASE_URL
    });
    
    this.defaultTimeout = 10000; // 10 seconds timeout for production
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 1
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    console.log('🌐 Making request to:', url);
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Nepal-Gov-Portal/1.0'
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.defaultTimeout),
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`📡 Fetching from: ${url} (attempt ${attempt + 1}/${retries + 1})`);
        const response = await fetch(url, requestOptions)
        
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text()
          // console.error('❌ HTTP Error:', response.status, errorText);
          
          // Don't retry for client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }
          
          // Retry for server errors (5xx) or network issues
          if (attempt === retries) {
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }
          continue;
        }

        const data = await response.json()
        
        // Handle API response wrapper
        if (data.success === false) {
          // console.error('❌ API Error:', data.error);
          throw new Error(data.error || 'API request failed')
        }

        console.log('✅ API request successful');
        return data
      } catch (error) {
        if (attempt === retries) {
          if (error instanceof Error) {
            // console.error(`❌ API Request failed for ${url} after ${retries + 1} attempts:`, error.message)
            // For SSR, throw a specific error that can be caught
            if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
              throw new Error('NEXT_HTTP_ERROR_FALLBACK;504')
            }
            throw error
          }
          throw new Error('Unknown API error occurred')
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Maximum retries exceeded')
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)))
          } else {
            searchParams.append(key, String(value))
          }
        }
      })
      
      const query = searchParams.toString()
      if (query) {
        url += (url.includes('?') ? '&' : '?') + query
      }
    }

    return this.makeRequest<T>(url, { method: 'GET' }, 0) // No retries for GET requests to fail fast
  }

  // Generic POST request
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  // Generic PUT request  
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  // Generic PATCH request
  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' })
  }

  // Unwrap API response data
  unwrapResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.error || 'API request was not successful')
    }
    return response.data
  }

  // Unwrap paginated API response
  unwrapPaginatedResponse<T>(response: PaginatedApiResponse<T>) {
    if (!response.success) {
      throw new Error(response.error || 'API request was not successful')
    }
    return {
      items: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
      hasNext: response.hasNext,
      hasPrev: response.hasPrev,
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health')
  }
}

// Export singleton instance
export const publicApiClient = new PublicApiClient()