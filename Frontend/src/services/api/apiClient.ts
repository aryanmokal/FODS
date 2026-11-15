/**
 * InstaDS Centralized API Client
 *
 * Configured for Python FastAPI backend compatibility:
 * - Reads VITE_API_BASE_URL from environment
 * - Injects JWT Bearer token from localStorage
 * - Provides fallback to local Mock Service when VITE_API_BASE_URL is not configured
 */

const env = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env || {};
const API_BASE_URL = env.VITE_API_BASE_URL || '';
const FORCE_MOCK = env.VITE_USE_MOCK === 'true' || !API_BASE_URL;

export const isMockMode = (): boolean => {
  return FORCE_MOCK || !API_BASE_URL;
};

export const getApiBaseUrl = (): string => API_BASE_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const token = localStorage.getItem('instads_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${API_BASE_URL}${cleanEndpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: this.getHeaders(options?.headers),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      const message =
        (errorData as { message?: string; detail?: string })?.detail ||
        (errorData as { message?: string })?.message ||
        `HTTP Error ${response.status}`;
      throw new ApiError(message, response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
