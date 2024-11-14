import ModelDiscount from '@models/discount';
import { UpdateDiscount } from '@dtos/discount.dto';
import { Discount } from '@models/entities/discount';

class DiscountRepository {
  async getAll() {
    return ModelDiscount.find();
  }
  async getById(discountId: string) {
    return ModelDiscount.findById(discountId);
  }
  async create(payload: Discount) {
    return ModelDiscount.create(payload);
  }

  async updateById(discountId: string, payload: UpdateDiscount) {
    return ModelDiscount.findOneAndUpdate({ _id: discountId }, payload, { new: true });
  }

  async getActiveDiscountByProductId(productId: string) {
    const today = new Date();
    return ModelDiscount.find({
      $and: [
        { product_ids: { $in: [productId] } },
        { active: true },
        { start_date: { $lte: today } },
        { end_date: { $gte: today } },
      ],
    });
  }
}

export default new DiscountRepository();
