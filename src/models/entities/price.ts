import { Document } from 'mongoose';
import { Discount } from './discount';

export interface PriceDocument extends Price, Document {}

export interface Price {
  article_id: string;
  price: number;
  start_date: Date;
  end_date: Date;  
}

export interface PriceWithSpecialPrice extends Price {
  price_with_discount?: number;
  discounts?: Discount[];
}
