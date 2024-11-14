import { Document } from 'mongoose';

export interface CouponUsageDocument extends CouponUsage, Document {}
export interface CouponUsage {
  code: string;
}
