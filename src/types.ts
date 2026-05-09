export interface Review {
  id: string;
  productId?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  ratings: number;
  reviewsCount: number;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  userId?: string;
  createdAt: string;
}
