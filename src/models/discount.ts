import { model, Schema } from 'mongoose';
import { DiscountDocument } from './entities/discount';

export const DiscountSchema = new Schema<DiscountDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['PERCENTAGE', 'FIXED'],
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
    product_ids: {
      type: [String], 
      required: true,
    },
  },
  {
    collection: 'discounts',
    timestamps: true, 
  }
);

const DiscountModel = model<DiscountDocument>('Discount', DiscountSchema);
export default DiscountModel;
