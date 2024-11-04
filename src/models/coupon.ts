import { model, Schema } from 'mongoose';
import { Coupon } from './entities/coupon';

export const CouponSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    discount_id: {
      type: String,
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
  { collection: 'coupons' }
);

const modelCoupon = model<Coupon>('Coupon', CouponSchema);
export default modelCoupon;
