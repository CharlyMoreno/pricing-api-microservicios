import { Router } from 'express';
import testRoute from './test.route';

const router = Router();

router.use(testRoute);

export default router;
