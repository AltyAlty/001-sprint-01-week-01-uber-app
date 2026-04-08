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
describe('Driver API', () => {
    /*Создание экземпляра приложения Express.*/
    const app = (0, express_1.default)();
    /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
    (0, setup_app_1.setupApp)(app);
    /*Подготавливаем тестовые данные.*/
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
    /*Перед запуском тестов, очищаем БД с данными по водителям.*/
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete('/api/testing/all-data')
            .expect(http_statuses_1.HttpStatus.NoContent);
    }));
    /*Описываем тест, проверяющий добавление нового водителя в БД.*/
    it('should create driver; POST /api/drivers', () => __awaiter(void 0, void 0, void 0, function* () {
        const newDriver = Object.assign(Object.assign({}, testDriverData), { name: 'Feodor' });
        yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(newDriver)
            .expect(http_statuses_1.HttpStatus.Created);
    }));
    /*Описываем тест, проверяющий данных по всем водителями из БД.*/
    it('should return drivers list; GET /api/drivers', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, testDriverData), { name: 'Another Driver' }))
            .expect(http_statuses_1.HttpStatus.Created);
        yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, testDriverData), { name: 'Another Driver2' }))
            .expect(http_statuses_1.HttpStatus.Created);
        const driverListResponse = yield (0, supertest_1.default)(app)
            .get('/api/drivers')
            .expect(http_statuses_1.HttpStatus.Ok);
        expect(driverListResponse.body).toBeInstanceOf(Array);
        expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
    }));
    /*Описываем тест, проверяющий получение данных по водителю по id из БД.*/
    it('should return driver by id; GET /api/drivers/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, testDriverData), { name: 'Another Driver3' }))
            .expect(http_statuses_1.HttpStatus.Created);
        const getResponse = yield (0, supertest_1.default)(app)
            .get(`/api/drivers/${createResponse.body.id}`)
            .expect(http_statuses_1.HttpStatus.Ok);
        expect(getResponse.body).toEqual(Object.assign(Object.assign({}, createResponse.body), { id: expect.any(Number), createdAt: expect.any(String) }));
    }));
    /*Описываем тест, проверяющий изменение данных по водителю по id в БД.*/
    it('should update driver; PUT /api/drivers/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, testDriverData), { name: 'Another Driver4' }))
            .expect(http_statuses_1.HttpStatus.Created);
        const driverUpdateData = {
            name: 'Updated Name',
            phoneNumber: '999-888-7777',
            email: 'updated@example.com',
            vehicleMake: 'Tesla',
            vehicleModel: 'Model S',
            vehicleYear: 2022,
            vehicleLicensePlate: 'NEW-789',
            vehicleDescription: 'Updated vehicle description',
            vehicleFeatures: [driver_1.VehicleFeature.ChildSeat],
        };
        yield (0, supertest_1.default)(app)
            .put(`/api/drivers/${createResponse.body.id}`)
            .send(driverUpdateData)
            .expect(http_statuses_1.HttpStatus.NoContent);
        const driverResponse = yield (0, supertest_1.default)(app).get(`/api/drivers/${createResponse.body.id}`);
        expect(driverResponse.body).toEqual(Object.assign(Object.assign({}, driverUpdateData), { id: createResponse.body.id, createdAt: expect.any(String) }));
    }));
    /*Описываем тест, проверяющий удаление водителя по id в БД.*/
    it('DELETE /api/drivers/:id and check after NOT FOUND', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: { id: createdDriverId }, } = yield (0, supertest_1.default)(app)
            .post('/api/drivers')
            .send(Object.assign(Object.assign({}, testDriverData), { name: 'Another Driver5' }))
            .expect(http_statuses_1.HttpStatus.Created);
        yield (0, supertest_1.default)(app)
            .delete(`/api/drivers/${createdDriverId}`)
            .expect(http_statuses_1.HttpStatus.NoContent);
        const driverResponse = yield (0, supertest_1.default)(app).get(`/api/drivers/${createdDriverId}`);
        expect(driverResponse.status).toBe(http_statuses_1.HttpStatus.NotFound);
    }));
});
