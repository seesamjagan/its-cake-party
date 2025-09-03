export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  quantity: string;
  price: number;
  category: string;
  featured: boolean;
  ingredients: string[];
  allergens: string[];
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ContactFormData extends CustomerInfo {
  message: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export type ThemeMode = 'light' | 'dark' | 'teal-coral';

export interface ThemeContextType {
  isDark: boolean;
  currentTheme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export interface CartAction {
  type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_QUANTITY' | 'CLEAR_CART' | 'LOAD_CART';
  payload?: any;
}

export interface CartState {
  items: CartItem[];
}