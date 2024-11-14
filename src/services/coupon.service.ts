import { CustomError } from '@config/errors/error.model';
import { ApplyCoupon } from '@dtos/coupon.dto';
import { Coupon } from '@models/entities/coupon';
import couponRepository from '@repositories/coupon.repository';
import priceService from './price.service';
import { PriceWithSpecialPrice } from '@models/entities/price';
import { TypeDiscount } from '@dtos/enum/type_discount.enum';
import { validateDiscount } from '@utils/validate_discount';
import couponUsageService from './coupon_usage.service';

class CouponService {
  async getCoupons() {
    return couponRepository.getCoupons();
  }
  async createCoupon(payload: Coupon) {
    const existCoupon = await couponRepository.getCouponByCode(payload.code);
    if (existCoupon) {
      throw new CustomError('Coupon already exists with this code.', 400);
    }

    let { discount_type, discount_value, ...rest } = payload;
    ({ discount_type, discount_value } = validateDiscount({ discount_type, discount_value: discount_value || 0 }));

    return couponRepository.create({ discount_type, discount_value, ...rest });
  }
  async updateCoupon(couponId: string, payload: Coupon) {
    const coupon = await couponRepository.getById(couponId);
    if (!coupon) {
      throw new CustomError('Coupon not found', 404);
    }
    return couponRepository.updateById(couponId, payload);
  }

  async applyCoupon(payload: ApplyCoupon) {
    const { code, article_ids } = payload;
    const coupon = await couponRepository.getActiveCoupon(code);

    if (!coupon) {
      throw new CustomError('Invalid or inactive coupon or outside the date range', 400);
    }

    if (coupon.applicable_products && !article_ids.every((id) => coupon.applicable_products?.includes(id))) {
      throw new CustomError('Coupon is not valid for one or more selected products', 400);
    }

    const products = await priceService.getManyProducts(article_ids);
    const {totalWithDiscount,total} = this.calculateTotalPurchase(products);

    if (coupon.minimum_purchase && totalWithDiscount < coupon.minimum_purchase) {
      throw new CustomError('Total purchase amount is below the minimum required', 400);
    }

    const usage = await couponUsageService.getCouponUsageByCode(code);
    if (usage.length >= coupon.uses_limit) {
      throw new CustomError('Coupon usage limit exceeded', 400);
    }
    const discount = this.calculateDiscount(coupon, totalWithDiscount);
    return {
      subtotal: total,
      total: totalWithDiscount,
      total_with_coupon: discount,
      coupon,
      products,
    };
  }

  private calculateTotalPurchase(products: PriceWithSpecialPrice[]) {
    const totalWithDiscount = products.reduce(
      (totalWithDiscount, product) => totalWithDiscount + (product.price_with_discount || 0),
      0
    );
    const total = products.reduce((total, product) => total + (product.price || 0), 0);
    return { totalWithDiscount, total };
  }

  private calculateDiscount(coupon: Coupon, totalPurchase: number): number {
    if (coupon.discount_type === TypeDiscount.PERCENTAGE) {
      const discountAmount = (totalPurchase * (coupon.discount_value || 0)) / 100;
      return totalPurchase - discountAmount;
    }
    if (coupon.discount_type === TypeDiscount.FIXED) {
      return totalPurchase - (coupon.discount_value || 0);
    }
    return totalPurchase;
  }
}

export default new CouponService();
