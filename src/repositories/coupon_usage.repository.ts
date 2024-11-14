import ModelCouponUsage from '@models/coupon_usage';

class CouponUsageRepository {
  async getCouponByCode(code: string) {
    return ModelCouponUsage.find({ code });
  }
}

export default new CouponUsageRepository();
