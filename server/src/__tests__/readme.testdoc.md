# Backend Testing Guide

## How to Run All Tests

```
npm test
```

## How to Add a New Test

- **Unit tests:**
  - Place in `src/__tests__` with `.spec.js` suffix.
  - Import the function/class to test.
  - Use `describe`/`it` blocks and `expect()` assertions.
- **Integration tests:**
  - Use Supertest to call API endpoints.
  - Use `mongodb-memory-server` for an in-memory DB.
  - Clean up data in `afterEach` or `beforeEach`.

## Example Patterns
- See `razorpayService.spec.js` for a unit test example.
- See `user.routes.spec.js` for an integration test example.

## Tips
- Use `beforeAll`/`afterAll` for setup/teardown.
- Use `afterEach` to clean up test data.
- Use `.only` or `.skip` on tests to focus or skip.

---
Happy testing! 