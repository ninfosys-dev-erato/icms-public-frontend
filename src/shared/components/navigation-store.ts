import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Menu, MenuItem, Breadcrumb } from '@/models'

interface NavigationState {
  // Menu data
  headerMenu: Menu | null
  footerMenu: Menu | null
  sidebarMenu: Menu | null
  
  // Current navigation state
  currentPath: string
  breadcrumbs: Breadcrumb
  activeMenuItem: MenuItem | null
  
  // Mobile navigation
  mobileMenuOpen: boolean
  mobileSubmenuOpen: string | null
  
  // Loading states
  isLoadingNavigation: boolean
  navigationError: string | null
  lastUpdated: Date | null
  
  // Actions
  setHeaderMenu: (menu: Menu | null) => void
  setFooterMenu: (menu: Menu | null) => void
  setSidebarMenu: (menu: Menu | null) => void
  setCompleteNavigation: (navigation: {
    header: Menu | null
    footer: Menu | null
    sidebar: Menu | null
  }) => void
  
  setCurrentPath: (path: string) => void
  setBreadcrumbs: (breadcrumbs: Breadcrumb) => void
  setActiveMenuItem: (item: MenuItem | null) => void
  
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileSubmenu: (itemId: string) => void
  closeMobileSubmenu: () => void
  
  setLoadingNavigation: (loading: boolean) => void
  setNavigationError: (error: string | null) => void
  
  // Helper methods
  isPathActive: (path: string) => boolean
  findMenuItemByPath: (path: string) => MenuItem | null
  refreshNavigation: () => void
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      headerMenu: null,
      footerMenu: null,
      sidebarMenu: null,
      
      currentPath: '/',
      breadcrumbs: [],
      activeMenuItem: null,
      
      mobileMenuOpen: false,
      mobileSubmenuOpen: null,
      
      isLoadingNavigation: false,
      navigationError: null,
      lastUpdated: null,
      
      // Menu setters
      setHeaderMenu: (menu) => set((state) => {
        state.headerMenu = menu
        state.lastUpdated = new Date()
      }),
      
      setFooterMenu: (menu) => set((state) => {
        state.footerMenu = menu
        state.lastUpdated = new Date()
      }),
      
      setSidebarMenu: (menu) => set((state) => {
        state.sidebarMenu = menu
        state.lastUpdated = new Date()
      }),
      
      setCompleteNavigation: (navigation) => set((state) => {
        state.headerMenu = navigation.header
        state.footerMenu = navigation.footer
        state.sidebarMenu = navigation.sidebar
        state.lastUpdated = new Date()
      }),
      
      // Navigation state setters
      setCurrentPath: (path) => set((state) => {
        state.currentPath = path
        
        // Auto-update active menu item when path changes
        const activeItem = get().findMenuItemByPath(path)
        state.activeMenuItem = activeItem
      }),
      
      setBreadcrumbs: (breadcrumbs) => set((state) => {
        state.breadcrumbs = breadcrumbs
      }),
      
      setActiveMenuItem: (item) => set((state) => {
        state.activeMenuItem = item
      }),
      
      // Mobile menu actions
      toggleMobileMenu: () => set((state) => {
        state.mobileMenuOpen = !state.mobileMenuOpen
        if (!state.mobileMenuOpen) {
          state.mobileSubmenuOpen = null
        }
      }),
      
      setMobileMenuOpen: (open) => set((state) => {
        state.mobileMenuOpen = open
        if (!open) {
          state.mobileSubmenuOpen = null
        }
      }),
      
      toggleMobileSubmenu: (itemId) => set((state) => {
        state.mobileSubmenuOpen = state.mobileSubmenuOpen === itemId ? null : itemId
      }),
      
      closeMobileSubmenu: () => set((state) => {
        state.mobileSubmenuOpen = null
      }),
      
      // Loading state setters
      setLoadingNavigation: (loading) => set((state) => {
        state.isLoadingNavigation = loading
        if (loading) {
          state.navigationError = null
        }
      }),
      
      setNavigationError: (error) => set((state) => {
        state.navigationError = error
        state.isLoadingNavigation = false
      }),
      
      // Helper methods
      isPathActive: (path) => {
        const currentPath = get().currentPath
        if (path === currentPath) return true
        if (path !== '/' && currentPath.startsWith(path)) return true
        return false
      },
      
      findMenuItemByPath: (path) => {
        const findInItems = (items: MenuItem[]): MenuItem | null => {
          for (const item of items) {
            if (item.url === path) return item
            if (item.children) {
              const found = findInItems(item.children)
              if (found) return found
            }
          }
          return null
        }
        
        const state = get()
        
        // Search in header menu
        if (state.headerMenu?.items) {
          const found = findInItems(state.headerMenu.items)
          if (found) return found
        }
        
        // Search in sidebar menu
        if (state.sidebarMenu?.items) {
          const found = findInItems(state.sidebarMenu.items)
          if (found) return found
        }
        
        return null
      },
      
      refreshNavigation: () => set((state) => {
        // This would typically trigger a re-fetch of navigation data
        state.lastUpdated = null
        state.navigationError = null
      }),
    })),
    {
      name: 'navigation-store',
    }
  )
)

// Selector hooks for optimized re-renders
export const useHeaderMenu = () => useNavigationStore((state) => state.headerMenu)
export const useFooterMenu = () => useNavigationStore((state) => state.footerMenu)
export const useSidebarMenu = () => useNavigationStore((state) => state.sidebarMenu)
export const useCurrentPath = () => useNavigationStore((state) => state.currentPath)
export const useBreadcrumbs = () => useNavigationStore((state) => state.breadcrumbs)
export const useActiveMenuItem = () => useNavigationStore((state) => state.activeMenuItem)
export const useMobileMenuState = () => useNavigationStore((state) => ({
  isOpen: state.mobileMenuOpen,
  submenuOpen: state.mobileSubmenuOpen,
  toggle: state.toggleMobileMenu,
  setOpen: state.setMobileMenuOpen,
  toggleSubmenu: state.toggleMobileSubmenu,
  closeSubmenu: state.closeMobileSubmenu,
}))