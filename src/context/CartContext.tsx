import { createContext, useState, useContext, ReactNode } from 'react';

// Types
export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  type: 'account' | 'balance' | 'game';
  quantity: number;
  discount?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discountedTotal: number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('steamshop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('steamshop_cart', JSON.stringify(items));
    return items;
  };

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id && i.type === item.type);

      if (existingItem) {
        // If item already exists, increase quantity
        return saveCart(
          prevItems.map((i) =>
            i.id === item.id && i.type === item.type
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        );
      } else {
        // Add new item with quantity 1
        return saveCart([...prevItems, { ...item, quantity: 1 }]);
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) =>
      saveCart(prevItems.filter((item) => item.id !== id))
    );
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      saveCart(
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems(saveCart([]));
  };

  // Calculate total number of items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate discounted total
  const discountedTotal = cartItems.reduce(
    (total, item) => {
      const itemPrice = item.price * item.quantity;
      if (item.discount) {
        return total + (itemPrice * (1 - item.discount / 100));
      }
      return total + itemPrice;
    },
    0
  );

  // Context values
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    discountedTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
