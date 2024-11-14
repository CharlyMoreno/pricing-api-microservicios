class TestService {
  async testEndpoint() {
    return Promise.resolve({ message: 'Test OK', status: 200 });
  }
}

export default new TestService();
