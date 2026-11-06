export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  unit: string;
  image: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  badge?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  bulkDiscountTiers?: { minQty: number; discountPercent: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryNotes?: string;
  isB2B?: boolean;
  companyName?: string;
  gstNumber?: string;
}

export type DeliveryMethod = 'standard' | 'express' | 'pickup';

export type PaymentMethod = 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'cod';

export interface TrackingStep {
  step: string;
  timestamp: string;
  done: boolean;
  detail: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  customer: CustomerDetails;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingFee: number;
  total: number;
  orderStatus: 'Placed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingSteps: TrackingStep[];
}

export interface BulkQuoteRequest {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  email: string;
  productName: string;
  quantity: string;
  deliveryLocation: string;
  notes: string;
  status: 'Pending' | 'Contacted' | 'Quoted' | 'Closed';
}

export interface FilterState {
  search: string;
  category: string;
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  minRating: number;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface StoreConfig {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  pinCode: string;
  city: string;
  state: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  taxRate: number; // 0.18 for 18% GST
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  role: 'contractor' | 'builder' | 'homeowner' | 'engineer';
  companyName?: string;
  gstNumber?: string;
}
