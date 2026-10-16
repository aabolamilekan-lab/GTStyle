import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // Composite key: `${variantId}-${engravingText || 'no-engraving'}`
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  metalType: string;
  ringSize: number | null;
  priceCents: number; // in integer kobo
  image: string;
  quantity: number;
  engravingText?: string;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotalCents: () => number;
  totalItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const trimmedEngraving = item.engravingText?.trim() || "no-engraving";
        const compositeId = `${item.variantId}-${trimmedEngraving}`;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === compositeId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            };
            return { items: updatedItems, isOpen: true };
          }

          const newItem: CartItem = {
            ...item,
            id: compositeId,
            engravingText: item.engravingText?.trim() || undefined,
          };

          return {
            items: [...state.items, newItem],
            isOpen: true,
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, qty: number) => {
        if (qty < 1) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Math.floor(qty)) } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      subtotalCents: () => {
        return get().items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
      },

      totalItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "gtstyle-cart",
      storage: createJSONStorage(() => localStorage),
      // Don't persist isOpen state across sessions
      partialize: (state) => ({ items: state.items } as unknown as CartStore),
    }
  )
);
