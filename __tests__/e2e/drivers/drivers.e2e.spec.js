'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const express_1 = __importDefault(require('express'));
const setup_app_1 = require('../../../src/setup-app');
const http_statuses_1 = require('../../../src/core/types/http-statuses');
describe('Driver API', () => {
  const app = (0, express_1.default)();
  (0, setup_app_1.setupApp)(app);
  const testDriverData = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield (0, supertest_1.default)(app)
        .delete('/testing/all-data')
        .expect(http_statuses_1.HttpStatus.NoContent);
    }),
  );
  it('should create driver; POST /drivers', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const newDriver = Object.assign(Object.assign({}, testDriverData), {
        name: 'Valentin',
        phoneNumber: '123-456-7890',
        email: 'valentin@example.com',
      });
      yield (0, supertest_1.default)(app)
        .post('/drivers')
        .send(newDriver)
        .expect(http_statuses_1.HttpStatus.Created);
    }));
  it('should return drivers list; GET /drivers', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield (0, supertest_1.default)(app)
        .post('/drivers')
        .send(
          Object.assign(Object.assign({}, testDriverData), {
            name: 'Another Driver',
          }),
        )
        .expect(http_statuses_1.HttpStatus.Created);
      yield (0, supertest_1.default)(app)
        .post('/drivers')
        .send(
          Object.assign(Object.assign({}, testDriverData), {
            name: 'Another Driver2',
          }),
        )
        .expect(http_statuses_1.HttpStatus.Created);
      const driverListResponse = yield (0, supertest_1.default)(app)
        .get('/drivers')
        .expect(http_statuses_1.HttpStatus.Ok);
      expect(driverListResponse.body).toBeInstanceOf(Array);
      expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
    }));
  it('should return driver by id; GET /drivers/:id', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const createResponse = yield (0, supertest_1.default)(app)
        .post('/drivers')
        .send(
          Object.assign(Object.assign({}, testDriverData), {
            name: 'Another Driver',
          }),
        )
        .expect(http_statuses_1.HttpStatus.Created);
      const getResponse = yield (0, supertest_1.default)(app)
        .get(`/drivers/${createResponse.body.id}`)
        .expect(http_statuses_1.HttpStatus.Ok);
      expect(getResponse.body).toEqual(
        Object.assign(Object.assign({}, createResponse.body), {
          id: expect.any(Number),
          createdAt: expect.any(String),
        }),
      );
    }));
});
//# sourceMappingURL=drivers.e2e.spec.js.map
