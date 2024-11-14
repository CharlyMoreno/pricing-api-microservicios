import { CustomError } from '@config/errors/error.model';
import { UpdateDiscount } from '@dtos/discount.dto';
import { TypeDiscount } from '@dtos/enum/type_discount.enum';
import { Discount } from '@models/entities/discount';
import discountRepository from '@repositories/discount.repository';

class DiscountService {
  async getDiscounts() {
    return discountRepository.getAll();
  }
  async createDiscount(payload: Discount) {
    return discountRepository.create(payload);
  }
  async updateDiscount(discountId: string, payload: UpdateDiscount) {
    const discount = await discountRepository.getById(discountId);
    if (!discount) {
      throw new CustomError('Discount not found', 404);
    }
    return discountRepository.updateById(discountId, payload);
  }

  applyDiscount(price: number, discount: Discount): number {
    if (discount.type === TypeDiscount.PERCENTAGE) {
      const discountAmount = (price * discount.value) / 100;
      return price - discountAmount;
    } else if (discount.type === TypeDiscount.FIXED) {
      return price - discount.value;
    }
    return price;
  }

  async calculateDiscountToarticleId(articleId: string, price: number) {
    const discounts = await discountRepository.getActiveDiscountByArticleId(articleId);
    if (!discounts) {
      return { specialPrice: price, discounts: [] };
    }
    const specialPrice = discounts.reduce((currentPrice, discount) => {
      return this.applyDiscount(currentPrice, discount);
    }, price);

    return { specialPrice: Math.max(specialPrice, 0), discounts };
  }
}

export default new DiscountService();
