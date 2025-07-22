import { create } from 'zustand';

interface mainFilterState {
  searchTerm: string;
  activeTab: 'place' | 'post';
  setSearchTerm: (searchTerm: string) => void;
  setActiveTab: (activeTab: 'place' | 'post') => void;
}

export const useMainFilterStore = create<mainFilterState>((set) => ({
  searchTerm: '',
  activeTab: 'place',
  setSearchTerm: (searchTerm) => set({ searchTerm: searchTerm }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
