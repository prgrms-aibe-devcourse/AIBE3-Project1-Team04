import { create } from 'zustand';

interface MessageModalState {
  modals: string[];
  addModal: (textContent: string) => void;
  deleteModal: () => void;
}

export const useMessageModal = create<MessageModalState>((set) => ({
  modals: [],
  addModal: (textContent: string) => set((state) => ({ modals: [textContent, ...state.modals] })),
  deleteModal: () => set((state) => ({ modals: state.modals.slice(0, -1) })),
}));
