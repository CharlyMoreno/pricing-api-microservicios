import { Price } from '@models/entities/price';
import ModelPrice from '@models/price';
import { UpdatePrice } from '@dtos/prices.dto';

class PriceRepository {
  async getPriceByProduct(articleId: string) {
    const today = new Date();
    return ModelPrice.findOne({
      article_id: articleId,
      start_date: { $lte: today },
      end_date: { $gte: today },
    });
  }

  async create(payload: Price) {
    return ModelPrice.create(payload);
  }

  async updateById(id: any, payload: UpdatePrice) {
    return ModelPrice.updateOne({ _id: id }, payload, { new: true });
  }

  async updateByarticleId(articleId: string, payload: UpdatePrice) {
    return ModelPrice.findOneAndUpdate({ article_id: articleId }, payload, { new: true });
  }

  async deleteByarticleId(articleId: string) {
    return ModelPrice.findOneAndDelete({ article_id: articleId });
  }

  async getManyProducts(articleIds: string[]) {
    const today = new Date();
    return ModelPrice.find({ article_id: { $in: articleIds }, start_date: { $lte: today }, end_date: { $gte: today } });
  }
}

export default new PriceRepository();
