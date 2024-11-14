import { TypeDiscount } from '@dtos/enum/type_discount.enum';
import { Document } from 'mongoose';

export interface CouponDocument extends Coupon, Document {}
export interface Coupon {
  code: string;
  discount_type: TypeDiscount;
  discount_value?: number;
  applicable_products?: string[];
  minimum_purchase?: number;
  uses_limit: number;
  start_date: Date;
  end_date: Date;
}
