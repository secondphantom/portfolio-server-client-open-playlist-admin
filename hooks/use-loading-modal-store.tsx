import { create } from "zustand";

interface ILoadingModalStore {
  isLoading: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useLoadingModalStore = create<ILoadingModalStore>((set) => ({
  isLoading: false,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
