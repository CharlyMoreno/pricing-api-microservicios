import { Document } from 'mongoose';

export interface Coupon extends Document {
  id: string;
  code: string;
  discount_id: string;
  active: boolean;
  start_date: Date;
  end_date: Date;
}