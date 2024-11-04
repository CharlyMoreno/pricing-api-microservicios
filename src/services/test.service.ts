import { CustomError } from '@config/errors/error.model';
import modelProduct from 'src/models/product';

class TestService {
  async testEndpoint() {
    return Promise.resolve({ message: 'Test OK', status: 200 });
  }
}

export default new TestService();
