"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const setup_app_1 = require("../../../src/setup-app");
const driver_1 = require("../../../src/drivers/types/driver");
const http_statuses_1 = require("../../../src/core/types/http-statuses");
/*Описываем тестовый набор.*/
describe('Driver API body validation check', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const correctTestDriverData = {
        name: 'Valentin',
        phoneNumber: '123-456-7890',
        email: 'valentin@example.com',
        vehicleMake: 'BMW',
        vehicleModel: 'X5',
        vehicleYear: 2021,
        vehicleLicensePlate: 'ABC-123',
        vehicleDescription: 'Some description',
        vehicleFeatures: [driver_1.VehicleFeature.ChildSeat],
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete('/api/testing/all-data')
            .expect(http_statuses_1.HttpStatus.NoContent);
    }));
    /*Описываем тест, проверяющий отказ в добавлении водителя с непрошедшими валидацию данными.*/
    it('should not create driver when incorrect body passed; POST /api/drivers', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidDataSet1 = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, correctTestDriverData), { name: '   ', phoneNumber: '    ', email: 'invalid email', vehicleMake: '' }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
        const invalidDataSet2 = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, correctTestDriverData), { phoneNumber: '', vehicleModel: '', vehicleYear: 'year', vehicleLicensePlate: '' }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorMessages).toHaveLength(4);
        const invalidDataSet3 = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, correctTestDriverData), { name: 'A' }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);
        const driverListResponse = yield (0, supertest_1.default)(app).get('/api/drivers');
        expect(driverListResponse.body).toHaveLength(0);
    }));
    /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными.*/
    it('should not update driver when incorrect data passed; PUT /api/drivers/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: { id: createdDriverId }, } = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign({}, correctTestDriverData))
            .expect(http_statuses_1.HttpStatus.Created);
        const invalidDataSet1 = yield (0, supertest_1.default)(app)
            .put(`/api/drivers/${createdDriverId}`)
            .send(Object.assign(Object.assign({}, correctTestDriverData), { name: '   ', phoneNumber: '    ', email: 'invalid email', vehicleMake: '' }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
        const invalidDataSet2 = yield (0, supertest_1.default)(app)
            .put(`/api/drivers/${createdDriverId}`)
            .send(Object.assign(Object.assign({}, correctTestDriverData), { phoneNumber: '', vehicleModel: '', vehicleYear: 'year', vehicleLicensePlate: '' }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorMessages).toHaveLength(4);
        const invalidDataSet3 = yield (0, supertest_1.default)(app)
            .put(`/api/drivers/${createdDriverId}`)
            .send(Object.assign(Object.assign({}, correctTestDriverData), { name: 'A' }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);
        const driverResponse = yield (0, supertest_1.default)(app).get(`/api/drivers/${createdDriverId}`);
        expect(driverResponse.body).toEqual(Object.assign(Object.assign({}, correctTestDriverData), { id: createdDriverId, createdAt: expect.any(String) }));
    }));
    /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными о фичах машины.*/
    it('should not update driver when incorrect features passed; PUT /api/drivers/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: { id: createdDriverId }, } = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign({}, correctTestDriverData))
            .expect(http_statuses_1.HttpStatus.Created);
        yield (0, supertest_1.default)(app)
            .put(`/api/drivers/${createdDriverId}`)
            .send(Object.assign(Object.assign({}, correctTestDriverData), { vehicleFeatures: [
                driver_1.VehicleFeature.ChildSeat,
                'invalid-feature',
                driver_1.VehicleFeature.WiFi,
            ] }))
            .expect(http_statuses_1.HttpStatus.BadRequest);
        const driverResponse = yield (0, supertest_1.default)(app).get(`/api/drivers/${createdDriverId}`);
        expect(driverResponse.body).toEqual(Object.assign(Object.assign({}, correctTestDriverData), { id: createdDriverId, createdAt: expect.any(String) }));
    }));
});
