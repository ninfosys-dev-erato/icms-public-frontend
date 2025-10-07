export class AdminApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;

  constructor(
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
    timeout = 8000,
    retries = 3
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.timeout = timeout;
    this.retries = retries;
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  async post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>("POST", path, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  async put<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>("PUT", path, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }

  private async request<T>(
    method: string,
    path: string,
    options?: RequestInit,
    attempt = 1
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
      
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "Nepal-Gov-Portal/1.0",
          ...options?.headers,
        },
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500 && attempt < this.retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
          return this.request<T>(method, path, options, attempt + 1);
        }
        
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Admin API ${method} ${path} failed with ${response.status}: ${errorText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return response.json() as Promise<T>;
      }

      return response.text() as Promise<T>;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        if (attempt < this.retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
          return this.request<T>(method, path, options, attempt + 1);
        }
        throw new Error(`Admin API ${method} ${path} timed out after ${this.timeout}ms`);
      }

      if (attempt < this.retries && this.isRetryableError(error)) {
        await this.delay(Math.pow(2, attempt) * 1000);
        return this.request<T>(method, path, options, attempt + 1);
      }

      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes("fetch failed") ||
        error.message.includes("network error") ||
        error.message.includes("ECONNRESET") ||
        error.message.includes("ETIMEDOUT")
      );
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params).filter(
      ([, value]) => value != null && value !== ""
    );
    
    if (filtered.length === 0) return "";
    
    const searchParams = new URLSearchParams();
    filtered.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }
}