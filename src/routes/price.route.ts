import { NextFunction, Request, Response, Router } from 'express';
import priceService from '@services/price.service';
import { RequestCreatePrice, RequestGetDeletePrice, RequestUpdatePrice } from '@dtos/prices.dto';

class PriceRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.post('/prices', this.createPrice.bind(this));
    this.router.get('/prices/:product_id', this.getPrice.bind(this));
    this.router.put('/prices/:product_id', this.updatePrice.bind(this));
    this.router.delete('/prices/:product_id', this.deletePrice.bind(this));
  }

  private createPrice(req: Request, res: Response, next: NextFunction) {
    const { body } = req as RequestCreatePrice;
    priceService
      .createPrice(body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private updatePrice(req: Request, res: Response, next: NextFunction) {
    const {
      params: { product_id },
      body,
    } = req as RequestUpdatePrice;
    priceService
      .updatePrice(product_id, body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private deletePrice(req: Request, res: Response, next: NextFunction) {
    const {
      params: { product_id },
    } = req as RequestGetDeletePrice;
    priceService
      .deletePrice(product_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  private getPrice(req: Request, res: Response, next: NextFunction) {
    const {
      params: { product_id },
    } = req as RequestGetDeletePrice;
    priceService
      .getPriceByProduct(product_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
}

export default new PriceRoute().router;
