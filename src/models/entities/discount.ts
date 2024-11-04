import { Document } from 'mongoose';

export interface Discount extends Document {
  id: string;
  name: string;
  type: string;
  value: number;
  active: boolean;
  start_date: Date;
  end_date: Date;
  product_id: string;
}