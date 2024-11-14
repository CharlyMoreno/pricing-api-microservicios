import { model, Schema } from 'mongoose';
import { PriceDocument } from './entities/price';

export const PriceSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: false,
    }
  },
  {
    collection: 'prices',
    timestamps: true, 
  }
);

const modelPrice = model<PriceDocument>('Price', PriceSchema);
export default modelPrice;