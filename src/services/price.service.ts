import { CustomError } from '@config/errors/error.model';
import { Price } from '@models/entities/price';
import priceRepository from '@repositories/price.repository';
import { UpdatePrice } from '@dtos/prices.dto';
import discountService from './discount.service';

class PriceService {
  async getPriceByProduct(productId: string) {
    const price: any = await priceRepository.getPriceByProduct(productId);
    if (!price) {
      throw new CustomError('Product not found', 404);
    }
    const { specialPrice, discounts } = await discountService.calculateDiscountToProductId(productId, price.price);
    return { ...price._doc, special_price: specialPrice, discounts };
  }

  async createPrice(payload: Price) {
    const existPrice = await priceRepository.getPriceByProduct(payload.product_id);
    if (existPrice) {
      throw new CustomError('Product ID already exists with a price', 400);
    }
    if (!payload.price) {
      throw new CustomError('Price is required', 400);
    }
    return priceRepository.create(payload);
  }

  async updatePrice(productId: string, payload: UpdatePrice) {
    const price = await priceRepository.getPriceByProduct(productId);
    if (!price) {
      throw new CustomError('Product not found', 404);
    }
    return priceRepository.updateByProductId(productId, payload);
  }

  async deletePrice(productId: string) {
    const price = await priceRepository.getPriceByProduct(productId);
    if (!price) {
      throw new CustomError('Product not found', 404);
    }
    return priceRepository.deleteByProductId(productId);
  }

  async getManyProducts(productIds: string[]) {
    const products = await priceRepository.getManyProducts(productIds);
    if (!products) {
      return [];
    }
    const promises = products.map(async (p: any) => {
      const { specialPrice, discounts } = await discountService.calculateDiscountToProductId(p.product_id, p.price);
      return { ...p._doc, special_price: specialPrice, discounts };
    });
    return Promise.all(promises);
  }
}

export default new PriceService();
