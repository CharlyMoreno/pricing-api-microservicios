import { NextFunction, Request, Response, Router } from 'express';
import priceService from '@services/price.service';
import { RequestCreatePrice, RequestGetDeletePrice, RequestUpdatePrice } from '@dtos/prices.dto';

class PriceRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.post('/prices', this.createUpdatePrice.bind(this));
    this.router.get('/prices/:article_id', this.getPrice.bind(this));
  }

  private createUpdatePrice(req: Request, res: Response, next: NextFunction) {
    const { body } = req as RequestCreatePrice;
    priceService
      .createUpdatePrice(body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private getPrice(req: Request, res: Response, next: NextFunction) {
    const {
      params: { article_id },
    } = req as RequestGetDeletePrice;
    priceService
      .getPriceByProduct(article_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
}

export default new PriceRoute().router;
