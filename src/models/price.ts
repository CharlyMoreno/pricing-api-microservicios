import { model, Schema } from 'mongoose';
import { PriceDocument } from './entities/price';

export const PriceSchema = new Schema(
  {
    article_id: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: false,
    },
  },
  {
    collection: 'prices',
    timestamps: true, 
  }
);

const modelPrice = model<PriceDocument>('Price', PriceSchema);
export default modelPrice;