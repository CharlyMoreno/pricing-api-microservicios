import { NextFunction, Request, Response, Router } from 'express';
import testService from '@services/test.service';
import { RequestApplyCoupon, RequestCreateCoupon, RequestUpdateCoupon } from '@dtos/coupon.dto';
import couponService from '@services/coupon.service';

class CouponsRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get('/coupons', this.getAllCoupons.bind(this));
    this.router.post('/coupons', this.createCoupon.bind(this));
    this.router.put('/coupons/:coupon_id', this.updateCoupon.bind(this));
    this.router.post('/coupons/apply', this.applyCoupon.bind(this));
  }

  private getAllCoupons(req: Request, res: Response, next: NextFunction) {
    couponService
      .getCoupons()
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private createCoupon(req: Request, res: Response, next: NextFunction) {
    const { body } = req as RequestCreateCoupon;

    couponService
      .createCoupon(body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
  private updateCoupon(req: Request, res: Response, next: NextFunction) {
    const {
      params: { coupon_id },
      body,
    } = req as RequestUpdateCoupon;

    couponService
      .updateCoupon(coupon_id, body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
  private applyCoupon(req: Request, res: Response, next: NextFunction) {
    const { body } = req as RequestApplyCoupon;

    couponService
      .applyCoupon(body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
}

export default new CouponsRoute().router;
