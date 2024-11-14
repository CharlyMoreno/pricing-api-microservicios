import { Coupon } from '@models/entities/coupon';
import { Request } from 'express';

export interface RequestCreateCoupon extends Request {
  body: Coupon;
}

export interface RequestApplyCoupon extends Request {
  body: ApplyCoupon;
}

export interface RequestUpdateCoupon extends Request {
  params: {
    coupon_id: string;
  };
  body: Coupon;
}

export interface ApplyCoupon {
  code: string;
  article_ids: string[];
}
