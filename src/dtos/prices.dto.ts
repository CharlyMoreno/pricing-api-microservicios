import { Price } from '@models/entities/price';
import { Request } from 'express';

export interface RequestCreatePrice extends Request {
  body: Price;
}

export interface RequestUpdatePrice extends Request {
  params: {
    product_id: string;
  };
  body: UpdatePrice;
}

export interface RequestGetDeletePrice extends Request {
  params: {
    product_id: string;
  };
}

export interface UpdatePrice extends Partial<Omit<Price, 'product_id'>> {}
