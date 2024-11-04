import { model, Schema } from 'mongoose';
import { Discount } from './entities/discount';

export const DiscountSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
  },
  { collection: 'discounts' }
);

const modelDiscount = model<Discount>('Discount', DiscountSchema);
export default modelDiscount;
