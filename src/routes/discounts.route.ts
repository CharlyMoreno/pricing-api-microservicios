import { NextFunction, Request, Response, Router } from 'express';
import discountService from '@services/discount.service';
import { RequestCreateDiscount, RequestUpdateDiscount } from '@dtos/discount.dto';
import { authMiddleware } from '@middlewares/auth.middleware';

class DiscountsRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get('/discounts', authMiddleware, this.getDiscounts.bind(this));
    this.router.post('/discounts', authMiddleware, this.createDiscount.bind(this));
    this.router.put('/discounts/:discount_id', authMiddleware, this.updateDiscount.bind(this));
  }

  private getDiscounts(req: Request, res: Response, next: NextFunction) {
    discountService
      .getDiscounts()
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private createDiscount(req: Request, res: Response, next: NextFunction) {
    const { body } = req as RequestCreateDiscount;
    discountService
      .createDiscount(body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private updateDiscount(req: Request, res: Response, next: NextFunction) {
    const {
      params: { discount_id },
      body,
    } = req as RequestUpdateDiscount;

    discountService
      .updateDiscount(discount_id, body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
}

export default new DiscountsRoute().router;
