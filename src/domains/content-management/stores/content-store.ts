import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { NewsArticle, Document, Service } from '@/domains/content-management/types';

interface ContentState {
  news: NewsArticle[];
  documents: Document[];
  services: Service[];
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
  
  setNews: (news: NewsArticle[]) => void;
  addNews: (article: NewsArticle) => void;
  updateNews: (id: string, updates: Partial<NewsArticle>) => void;
  removeNews: (id: string) => void;
  
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  
  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  removeService: (id: string) => void;
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  clearContent: () => void;
}

export const useContentStore = create<ContentState>()(
  devtools(
    persist(
      immer((set) => ({
        news: [],
        documents: [],
        services: [],
        searchQuery: '',
        selectedCategory: null,
        isLoading: false,
        error: null,
        
        setNews: (news) => set((state) => {
          state.news = news;
          state.isLoading = false;
          state.error = null;
        }),
        
        addNews: (article) => set((state) => {
          state.news.unshift(article);
        }),
        
        updateNews: (id, updates) => set((state) => {
          const index = state.news.findIndex(item => item.id === id);
          if (index !== -1) {
            Object.assign(state.news[index], updates);
          }
        }),
        
        removeNews: (id) => set((state) => {
          state.news = state.news.filter(item => item.id !== id);
        }),
        
        setDocuments: (documents) => set((state) => {
          state.documents = documents;
          state.isLoading = false;
          state.error = null;
        }),
        
        addDocument: (document) => set((state) => {
          state.documents.unshift(document);
        }),
        
        updateDocument: (id, updates) => set((state) => {
          const index = state.documents.findIndex(item => item.id === id);
          if (index !== -1) {
            Object.assign(state.documents[index], updates);
          }
        }),
        
        removeDocument: (id) => set((state) => {
          state.documents = state.documents.filter(item => item.id !== id);
        }),
        
        setServices: (services) => set((state) => {
          state.services = services;
          state.isLoading = false;
          state.error = null;
        }),
        
        addService: (service) => set((state) => {
          state.services.unshift(service);
        }),
        
        updateService: (id, updates) => set((state) => {
          const index = state.services.findIndex(item => item.id === id);
          if (index !== -1) {
            Object.assign(state.services[index], updates);
          }
        }),
        
        removeService: (id) => set((state) => {
          state.services = state.services.filter(item => item.id !== id);
        }),
        
        setSearchQuery: (query) => set((state) => {
          state.searchQuery = query;
        }),
        
        setSelectedCategory: (category) => set((state) => {
          state.selectedCategory = category;
        }),
        
        setLoading: (loading) => set((state) => {
          state.isLoading = loading;
        }),
        
        setError: (error) => set((state) => {
          state.error = error;
        }),
        
        clearContent: () => set((state) => {
          state.news = [];
          state.documents = [];
          state.services = [];
          state.searchQuery = '';
          state.selectedCategory = null;
          state.isLoading = false;
          state.error = null;
        }),
      })),
      {
        name: 'content-store',
        partialize: (state) => ({
          searchQuery: state.searchQuery,
          selectedCategory: state.selectedCategory,
        }),
      }
    ),
    {
      name: 'content-store',
    }
  )
);