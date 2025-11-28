import { create } from 'zustand';

export const useProductStore = create((set) => ({
  selectedBarcode: null,

  setSelectedBarcode: (barcode) => set({ selectedBarcode: barcode }),

  clearSelectedBarcode: () => set({ selectedBarcode: null }),
}));
