export interface Product {
  id: number;
  name: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  quantity: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: number;
  date: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  profit: number;
}

export type ActiveTab = 'products' | 'cart' | 'history' | 'add-product';

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  token: string;
}