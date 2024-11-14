import ModelCoupon from '@models/coupon';
import { Coupon } from '@models/entities/coupon';

class CouponRepository {
  async getCoupons() {
    return ModelCoupon.find();
  }
  async getById(couponId: string) {
    return ModelCoupon.findById(couponId);
  }
  async create(payload: Coupon) {
    return ModelCoupon.create(payload);
  }

  async updateById(discountId: string, payload: Coupon) {
    return ModelCoupon.findOneAndUpdate({ _id: discountId }, payload, { new: true });
  }

  async getActiveCoupon(code: string) {
    const today = new Date();
    return ModelCoupon.findOne({
      code,
      active: true,
      start_date: { $lte: today },
      end_date: { $gte: today },
    });
  }

  async getCouponByCode(code: string) {
    return ModelCoupon.findOne({ code });
  }
}

export default new CouponRepository();
