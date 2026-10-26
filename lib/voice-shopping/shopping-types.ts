export interface CartItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CartQuote {
  quote_id: string;
  items: CartItem[];
  total: number;
  currency: 'USD';
}

export interface ShoppingOrder extends CartQuote {
  order_id: string;
  status: 'unpaid' | 'cancelled';
  created_at: string;
  cancelled_at?: string;
}

export interface ShoppingSession {
  session_id: string;
  cart: CartQuote | null;
  orders: ShoppingOrder[];
  simulated: true;
}
