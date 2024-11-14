import { TypeDiscount } from '@dtos/enum/type_discount.enum';
import { Document } from 'mongoose';

export interface DiscountDocument extends Discount, Document {}
export interface Discount {
  name: string;
  type: TypeDiscount; // e.g., 'percentage' | 'fixed'
  value: number;
  start_date: Date;
  end_date: Date;
  article_ids: string[];
}
