import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { ICartItem, IProduct } from '../commons/types';
import { useNotification } from './NotificationContext';

export interface CartContextType {
  items: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: (silent?: boolean) => void;
} 

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<ICartItem[]>([]);
  const { showNotification } = useNotification();

 
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error)        {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: IProduct, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
    showNotification('success', 'Produto Adicionado', `${product.name} foi adicionado ao carrinho.`);
  };

  const removeFromCart = (productId: number) => {
    const removedItem = items.find(item => item.product.id === productId);
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    if (removedItem) {
      showNotification('warn', 'Produto Removido', `${removedItem.product.name} foi removido do carrinho.`);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    showNotification('info', 'Carrinho Atualizado', 'A quantidade do produto foi atualizada.');
  };

  const clearCart = (silent: boolean = false) => {
    setItems([]);
    if (!silent) {
      showNotification('error', 'Carrinho Esvaziado', 'Todos os produtos foram removidos do carrinho.');
    }
  };


  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };
