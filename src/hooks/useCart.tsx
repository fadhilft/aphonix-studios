import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          price,
          image,
          description
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formattedItems = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        created_at: item.created_at,
        product: item.products,
      }));
      setCartItems(formattedItems);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('cart_items')
      .insert({ user_id: user.id, product_id: productId });

    if (error) {
      if (error.code === '23505') {
        // Already in cart (unique constraint)
        return false;
      }
      console.error('Error adding to cart:', error);
      return false;
    }

    await fetchCart();
    return true;
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing from cart:', error);
      return false;
    }

    await fetchCart();
    return true;
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.product_id === productId);
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    isInCart,
    fetchCart,
    cartCount: cartItems.length,
  };
};
