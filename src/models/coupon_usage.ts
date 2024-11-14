import { model, Schema } from 'mongoose';
import { CouponUsageDocument } from './entities/coupon_usage';

export const CouponUsageSchema = new Schema<CouponUsageDocument>(
  {
    code: {
      type: String,
      required: true,
    }
  },
  {
    collection: 'coupons_usage',
    timestamps: true,
  }
);

const CouponUsageModel = model<CouponUsageDocument>('CouponUsage', CouponUsageSchema);
export default CouponUsageModel;
