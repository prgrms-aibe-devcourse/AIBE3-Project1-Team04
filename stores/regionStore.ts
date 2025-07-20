import { Place_City } from '@/types/place.type';
import { create } from 'zustand';

interface RegionState {
  regionsCity: Place_City[];
  setRegionsCity: (regionsCity: Place_City[]) => void;
}

export const useRegionStore = create<RegionState>((set) => ({
  regionsCity: [],
  setRegionsCity: (regionsCity: Place_City[]) => set({ regionsCity }),
}));
