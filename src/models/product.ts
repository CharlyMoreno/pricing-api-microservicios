import { model, Schema } from 'mongoose';
import { Product } from './entities/product';

export const ProductSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    special_price: {
      type: Number,
      default: null,
    },
  },
  { collection: 'products' }
);

const modelProduct = model<Product>('Product', ProductSchema);
export default modelProduct;