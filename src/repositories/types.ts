import type { Notice, NoticeFilter, NoticeListResponse } from "@/models/notice";
import type { Service, ServiceFilter, ServiceListResponse } from "@/models/service";
import type { Document, DocumentFilter, DocumentListResponse } from "@/models/document";
import type { DirectoryFilter, DirectoryListResponse, Contact, OfficeHierarchy } from "@/models/directory";
import type { Office, Person, LocalLevel } from "@/models/shared";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchQuery {
  q: string;
  filters?: Record<string, any>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  suggestions?: string[];
  facets?: Record<string, Array<{ value: string; count: number }>>;
}

export interface INoticeRepository {
  list(params: NoticeFilter): Promise<NoticeListResponse>;
  getBySlug(slug: string): Promise<Notice | null>;
  getById(id: string): Promise<Notice | null>;
  search(query: SearchQuery): Promise<SearchResult<Notice>>;
  getArchive(yearBS: string, monthBS?: string): Promise<Notice[]>;
  getStats(): Promise<any>;
}

export interface IServiceRepository {
  list(params: ServiceFilter): Promise<ServiceListResponse>;
  getBySlug(slug: string): Promise<Service | null>;
  getById(id: string): Promise<Service | null>;
  search(query: SearchQuery): Promise<SearchResult<Service>>;
  getCategories(): Promise<any[]>;
  getStats(): Promise<any>;
}

export interface IDocumentRepository {
  list(params: DocumentFilter): Promise<DocumentListResponse>;
  getBySlug(slug: string): Promise<Document | null>;
  getById(id: string): Promise<Document | null>;
  search(query: SearchQuery): Promise<SearchResult<Document>>;
  getByType(type: string, params?: Partial<DocumentFilter>): Promise<Document[]>;
  getCategories(): Promise<any[]>;
  getStats(): Promise<any>;
}

export interface IDirectoryRepository {
  list(params: DirectoryFilter): Promise<DirectoryListResponse>;
  getOffices(params?: Partial<DirectoryFilter>): Promise<Office[]>;
  getPeople(params?: Partial<DirectoryFilter>): Promise<Person[]>;
  getLocalLevels(params?: Partial<DirectoryFilter>): Promise<LocalLevel[]>;
  getContacts(params?: Partial<DirectoryFilter>): Promise<Contact[]>;
  getOfficeHierarchy(): Promise<OfficeHierarchy[]>;
  getOfficeById(id: string): Promise<Office | null>;
  getPersonById(id: string): Promise<Person | null>;
  getLocalLevelById(id: string): Promise<LocalLevel | null>;
  search(query: SearchQuery): Promise<SearchResult<Office | Person | LocalLevel>>;
  getStats(): Promise<any>;
}

export interface ISearchRepository {
  searchAll(query: SearchQuery): Promise<SearchResult<any>>;
  searchNotices(query: SearchQuery): Promise<SearchResult<Notice>>;
  searchServices(query: SearchQuery): Promise<SearchResult<Service>>;
  searchDocuments(query: SearchQuery): Promise<SearchResult<Document>>;
  searchDirectory(query: SearchQuery): Promise<SearchResult<Office | Person | LocalLevel>>;
  getSuggestions(query: string, type?: string): Promise<string[]>;
  indexDocument(type: string, id: string, document: any): Promise<void>;
  deleteDocument(type: string, id: string): Promise<void>;
}

export interface CacheOptions {
  ttl?: number; // seconds
  tags?: string[];
  staleWhileRevalidate?: number;
}

export interface ICacheRepository {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  invalidate(tags: string[]): Promise<void>;
  clear(): Promise<void>;
}