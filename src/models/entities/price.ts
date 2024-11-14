import { Document } from 'mongoose';
import { Discount } from './discount';

export interface PriceDocument extends Price, Document {}

export interface Price {
  product_id: string;
  price: number;
  category: string;
}

export interface PriceWithSpecialPrice extends Price {
  special_price?: number;
  discounts?: Discount[];
}
