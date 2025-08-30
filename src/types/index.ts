export interface Product {
  _id: string;
  id?: number; // For backward compatibility
  name: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  sizes: ProductSize[];
  description?: string;
  brand?: string;
  barcode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
}

export interface ProductFormData {
  name: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  sizes: ProductSize[];
  description?: string;
  brand?: string;
  barcode?: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
  quantity: number; // Total quantity for cart display
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

export interface UploadBatch {
  _id: string;
  uploadId: string;
  fileName: string;
  fileHash: string;
  productIds: string[];
  quantityChanges: QuantityChange[];
  uploadedAt: string;
}

export interface QuantityChange {
  productId: string;
  size: string;
  oldQuantity: number;
  newQuantity: number;
}

export interface UploadBatch {
  _id: string;
  uploadId: string;
  fileName: string;
  fileHash: string;
  productIds: string[];
  quantityChanges: QuantityChange[];
  uploadedAt: string;
}

export interface QuantityChange {
  productId: string;
  size: string;
  oldQuantity: number;
  newQuantity: number;
}

export type ActiveTab = 'products' | 'cart' | 'history' | 'manage-products';

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  token: string;
}