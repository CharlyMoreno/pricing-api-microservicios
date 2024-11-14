import couponUsageRepository from '@repositories/coupon_usage.repository';

class CouponUsageService {
  async getCouponUsageByCode(code: string) {
    return couponUsageRepository.getCouponByCode(code);
  }
}

export default new CouponUsageService();
