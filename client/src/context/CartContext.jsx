import { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [], total: 0 }); return; }
    try {
      setCartLoading(true);
      const res = await cartService.getCart();
      setCart(res.data.cart);
    } catch { setCart({ items: [], total: 0 }); }
    finally { setCartLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items'); return false; }
    try {
      const res = await cartService.addToCart(productId, quantity);
      setCart(res.data.cart);
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
      return false;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const res = await cartService.updateCartItem(productId, quantity);
      setCart(res.data.cart);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const removeItem = async (productId) => {
    try {
      const res = await cartService.removeFromCart(productId);
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch { toast.error('Remove failed'); }
  };

  const clearCartState = () => setCart({ items: [], total: 0 });

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, itemCount, addItem, updateItem, removeItem, clearCartState, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
