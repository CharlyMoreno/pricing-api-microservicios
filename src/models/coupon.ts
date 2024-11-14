import { model, Schema } from 'mongoose';
import { CouponDocument } from './entities/coupon';

export const CouponSchema = new Schema<CouponDocument>(
  {
    code: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ['PERCENTAGE', 'FIXED'],
    },
    discount_value: {
      type: Number,
      required: false,
    },
    applicable_products: {
      type: [String],
      required: false,
    },
    minimum_purchase: {
      type: Number,
      required: false,
    },
    uses_limit: {
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
  },
  {
    collection: 'coupons',
    timestamps: true,
  }
);

const CouponModel = model<CouponDocument>('Coupon', CouponSchema);
export default CouponModel;
