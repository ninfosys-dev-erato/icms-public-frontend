import { PublicApiClient } from '@/repositories/http/PublicApiClient';
import { 
  ApiResponse,
  PaginatedResponse 
} from '../../header/types/header';

// ========================================
// NAVIGATION TYPES (Backend Structure)
// ========================================

export enum MenuLocation {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
  SIDEBAR = 'SIDEBAR',
  TOP = 'TOP',
}

export enum MenuItemType {
  LINK = 'LINK',
  PAGE = 'PAGE',
  CATEGORY = 'CATEGORY',
  DOCUMENT = 'DOCUMENT',
}

export interface MenuResponse {
  id: string;
  name: {
    ne: string;
    en: string;
  };
  description?: {
    ne: string;
    en: string;
  };
  location: MenuLocation;
  order: number;
  isActive: boolean;
  isPublished: boolean;
  categorySlug?: string;
  resolvedUrl?: string;
  menuItemCount?: number;
  menuItems?: MenuItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemResponse {
  id: string;
  menuId: string;
  parentId?: string;
  title: {
    ne: string;
    en: string;
  };
  description?: {
    ne: string;
    en: string;
  };
  url?: string;
  target: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isPublished: boolean;
  itemType: MenuItemType;
  itemId?: string;
  categorySlug?: string;
  contentSlug?: string;
  resolvedUrl?: string;
  children?: MenuItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  location?: MenuLocation;
  isActive?: boolean;
  isPublished?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface MenuItemQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  menuId?: string;
  parentId?: string;
  itemType?: MenuItemType;
  isActive?: boolean;
  isPublished?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

// ========================================
// NAVIGATION REPOSITORY
// ========================================

/**
 * Repository responsible for navigation menu API interactions
 */
export interface NavigationRepository {
  // Menu operations
  getMenus(query?: MenuQueryDto): Promise<ApiResponse<PaginatedResponse<MenuResponse>>>;
  getMenuById(id: string): Promise<ApiResponse<MenuResponse>>;
  getMenuByLocation(location: MenuLocation): Promise<ApiResponse<MenuResponse>>;
  getMenuTree(id: string): Promise<ApiResponse<{ menu: MenuResponse; items: MenuItemResponse[] }>>;
  
  // Menu item operations
  getMenuItems(query?: MenuItemQueryDto): Promise<ApiResponse<PaginatedResponse<MenuItemResponse>>>;
  getMenuItemsByMenu(menuId: string, query?: MenuItemQueryDto): Promise<ApiResponse<PaginatedResponse<MenuItemResponse>>>;
  getMenuItemById(id: string): Promise<ApiResponse<MenuItemResponse>>;
  getBreadcrumb(itemId: string): Promise<ApiResponse<MenuItemResponse[]>>;
  searchMenuItems(searchTerm: string, query?: MenuItemQueryDto): Promise<ApiResponse<PaginatedResponse<MenuItemResponse>>>;
}

class NavigationRepositoryImpl implements NavigationRepository {
  private apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  // Menu operations
  async getMenus(query: MenuQueryDto = {}): Promise<ApiResponse<PaginatedResponse<MenuResponse>>> {
    const queryParams = new URLSearchParams();
    
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());
    if (query.search) queryParams.append('search', query.search);
    if (query.location) queryParams.append('location', query.location);
    if (query.isActive !== undefined) queryParams.append('isActive', query.isActive.toString());
    if (query.isPublished !== undefined) queryParams.append('isPublished', query.isPublished.toString());
    if (query.sort) queryParams.append('sort', query.sort);
    if (query.order) queryParams.append('order', query.order);

    const url = queryParams.toString() ? `/menus?${queryParams.toString()}` : '/menus';
    return this.apiClient.get<ApiResponse<PaginatedResponse<MenuResponse>>>(url);
  }

  async getMenuById(id: string): Promise<ApiResponse<MenuResponse>> {
    return this.apiClient.get<ApiResponse<MenuResponse>>(`/menus/${id}`);
  }

  async getMenuByLocation(location: MenuLocation): Promise<ApiResponse<MenuResponse>> {
    return this.apiClient.get<ApiResponse<MenuResponse>>(`/menus/location/${location}`);
  }

  async getMenuTree(id: string): Promise<ApiResponse<{ menu: MenuResponse; items: MenuItemResponse[] }>> {
    return this.apiClient.get<ApiResponse<{ menu: MenuResponse; items: MenuItemResponse[] }>>(`/menus/${id}/tree`);
  }

  // Menu item operations
  async getMenuItems(query: MenuItemQueryDto = {}): Promise<ApiResponse<PaginatedResponse<MenuItemResponse>>> {
    const queryParams = new URLSearchParams();
    
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());
    if (query.search) queryParams.append('search', query.search);
    if (query.menuId) queryParams.append('menuId', query.menuId);
    if (query.parentId) queryParams.append('parentId', query.parentId);
    if (query.itemType) queryParams.append('itemType', query.itemType);
    if (query.isActive !== undefined) queryParams.append('isActive', query.isActive.toString());
    if (query.isPublished !== undefined) queryParams.append('isPublished', query.isPublished.toString());
    if (query.sort) queryParams.append('sort', query.sort);
    if (query.order) queryParams.append('order', query.order);

    const url = queryParams.toString() ? `/menu-items?${queryParams.toString()}` : '/menu-items';
    return this.apiClient.get<ApiResponse<PaginatedResponse<MenuItemResponse>>>(url);
  }

  async getMenuItemsByMenu(menuId: string, query: MenuItemQueryDto = {}): Promise<ApiResponse<PaginatedResponse<MenuItemResponse>>> {
    const queryParams = new URLSearchParams();
    
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());
    if (query.search) queryParams.append('search', query.search);
    if (query.parentId) queryParams.append('parentId', query.parentId);
    if (query.itemType) queryParams.append('itemType', query.itemType);
    if (query.isActive !== undefined) queryParams.append('isActive', query.isActive.toString());
    if (query.isPublished !== undefined) queryParams.append('isPublished', query.isPublished.toString());
    if (query.sort) queryParams.append('sort', query.sort);
    if (query.order) queryParams.append('order', query.order);

    const url = queryParams.toString() ? `/menu-items/menu/${menuId}?${queryParams.toString()}` : `/menu-items/menu/${menuId}`;
    return this.apiClient.get<ApiResponse<PaginatedResponse<MenuItemResponse>>>(url);
  }

  async getMenuItemById(id: string): Promise<ApiResponse<MenuItemResponse>> {
    return this.apiClient.get<ApiResponse<MenuItemResponse>>(`/menu-items/${id}`);
  }

  async getBreadcrumb(itemId: string): Promise<ApiResponse<MenuItemResponse[]>> {
    return this.apiClient.get<ApiResponse<MenuItemResponse[]>>(`/menu-items/${itemId}/breadcrumb`);
  }

  async searchMenuItems(searchTerm: string, query: MenuItemQueryDto = {}): Promise<ApiResponse<PaginatedResponse<MenuItemResponse>>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('q', searchTerm);
    if (query.page) queryParams.append('page', query.page.toString());
    if (query.limit) queryParams.append('limit', query.limit.toString());
    if (query.menuId) queryParams.append('menuId', query.menuId);
    if (query.parentId) queryParams.append('parentId', query.parentId);
    if (query.itemType) queryParams.append('itemType', query.itemType);
    if (query.isActive !== undefined) queryParams.append('isActive', query.isActive.toString());
    if (query.isPublished !== undefined) queryParams.append('isPublished', query.isPublished.toString());
    if (query.sort) queryParams.append('sort', query.sort);
    if (query.order) queryParams.append('order', query.order);

    return this.apiClient.get<ApiResponse<PaginatedResponse<MenuItemResponse>>>(`/menu-items/search?${queryParams.toString()}`);
  }
}

export const navigationRepository: NavigationRepository = new NavigationRepositoryImpl();