import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getWhatsAppMessage: () => string;
  getWhatsAppLink: (phoneNumber: string) => string;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity || 1;
            return { items: newItems };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
            .filter((i) => i.quantity > 0),
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getCartItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getWhatsAppMessage: () => {
        const items = get().items;
        if (items.length === 0) return 'My cart is empty.';

        let message = `🛍️ *SYL SHOPPING CENTER - NEW ORDER*\n`;
        message += `=========================\n\n`;

        items.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          message += `${index + 1}. *${item.name}* [${item.category || 'General'}]\n`;
          message += `   Qty: ${item.quantity} × $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
          message += `   Subtotal: $${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
        });

        const total = get().getCartTotal();
        message += `=========================\n`;
        message += `💰 *Total Order Value: $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*\n\n`;
        message += `⚡ Please process my order. Thank you!`;

        return encodeURIComponent(message);
      },
      getWhatsAppLink: (phoneNumber) => {
        const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
        return `https://wa.me/${formattedPhone}?text=${get().getWhatsAppMessage()}`;
      },
    }),
    {
      name: 'syl-cart-storage',
    }
  )
);
