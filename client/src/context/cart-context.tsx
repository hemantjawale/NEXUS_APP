import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { CartItemWithProduct } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CartState {
  items: CartItemWithProduct[];
  itemCount: number;
  total: number;
  isLoading: boolean;
}

type CartAction = 
  | { type: "SET_ITEMS"; payload: CartItemWithProduct[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_ITEM"; payload: CartItemWithProduct }
  | { type: "UPDATE_ITEM"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_ITEMS":
      const items = action.payload;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const total = items.reduce((sum, item) => {
        const price = parseFloat(item.product?.price || "0");
        return sum + (price * item.quantity);
      }, 0);
      
      return {
        ...state,
        items,
        itemCount,
        total,
      };
      
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case "ADD_ITEM":
      return state; // Will be handled by refetch
      
    case "UPDATE_ITEM":
      return state; // Will be handled by refetch
      
    case "REMOVE_ITEM":
      return state; // Will be handled by refetch
      
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0,
      };
      
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  isLoading: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch("/api/cart", { credentials: "include" });
      
      if (!response.ok) {
        console.error("Failed to fetch cart:", response.status);
        dispatch({ type: "SET_ITEMS", payload: [] });
        return;
      }
      
      const items = await response.json();
      // Ensure items is always an array
      const itemsArray = Array.isArray(items) ? items : [];
      dispatch({ type: "SET_ITEMS", payload: itemsArray });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      dispatch({ type: "SET_ITEMS", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await apiRequest("PUT", `/api/cart/${productId}`, {
        quantity,
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await apiRequest("DELETE", `/api/cart/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiRequest("DELETE", "/api/cart");
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
