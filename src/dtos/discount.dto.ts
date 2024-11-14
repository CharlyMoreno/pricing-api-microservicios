import { Discount } from '@models/entities/discount';
import { Request } from 'express';

export interface RequestCreateDiscount extends Request {
  body: Discount;
}

export interface RequestUpdateDiscount extends Request {
  params: {
    discount_id: string;
  };
  body: UpdateDiscount;
}

export interface UpdateDiscount extends Partial<Omit<Discount, 'article_id'>> {}
