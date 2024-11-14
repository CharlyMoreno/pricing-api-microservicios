import { Price } from '@models/entities/price';
import ModelPrice from '@models/price';
import { UpdatePrice } from '@dtos/prices.dto';

class PriceRepository {
  async getPriceByProduct(productId: string) {
    return ModelPrice.findOne({
      product_id: productId,
    });
  }

  async create(payload: Price) {
    return ModelPrice.create(payload);
  }

  async updateByProductId(productId: string, payload: UpdatePrice) {
    return ModelPrice.findOneAndUpdate({ product_id: productId }, payload, { new: true });
  }

  async deleteByProductId(productId: string) {
    return ModelPrice.findOneAndDelete({ product_id: productId });
  }

  async getManyProducts(productIds: string[]) {
    return ModelPrice.find({ product_id: { $in: productIds } });
  }
}

export default new PriceRepository();
