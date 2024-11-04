import { CustomError } from "@config/errors/error.model";

class TestService {
  async testEndpoint() {
    throw new CustomError("Mensaje",400)
    return Promise.resolve({ message: 'Test OK', status: 200 });
  }
}

export default new TestService();
