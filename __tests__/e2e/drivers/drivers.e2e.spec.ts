import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';

/*Описываем тестовый набор.*/
describe('Driver API', () => {
  /*Создание экземпляра приложения Express.*/
  const app = express();
  /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
  setupApp(app);

  /*Подготавливаем тестовые данные.*/
  const testDriverData: DriverInputDto = {
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
  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  /*Описываем тест, проверяющий добавление нового водителя в БД.*/
  it('should create driver; POST /api/drivers', async () => {
    const newDriver: DriverInputDto = {
      ...testDriverData,
      name: 'Feodor',
    };

    await request(app)
      .post('/api/drivers')
      .send(newDriver)
      .expect(HttpStatus.Created);
  });

  /*Описываем тест, проверяющий получение данных по всем водителями из БД.*/
  it('should return drivers list; GET /api/drivers', async () => {
    await request(app)
      .post('/api/drivers')
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HttpStatus.Created);

    await request(app)
      .post('/api/drivers')
      .send({ ...testDriverData, name: 'Another Driver2' })
      .expect(HttpStatus.Created);

    const driverListResponse = await request(app)
      .get('/api/drivers')
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  /*Описываем тест, проверяющий получение данных по водителю по id из БД.*/
  it('should return driver by id; GET /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .send({ ...testDriverData, name: 'Another Driver3' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/drivers/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий изменение данных по водителю по id в БД.*/
  it('should update driver; PUT /api/drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/api/drivers')
      .send({ ...testDriverData, name: 'Another Driver4' })
      .expect(HttpStatus.Created);

    const driverUpdateData: DriverInputDto = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await request(app)
      .put(`/api/drivers/${createResponse.body.id}`)
      .send(driverUpdateData)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(
      `/api/drivers/${createResponse.body.id}`,
    );

    expect(driverResponse.body).toEqual({
      ...driverUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий удаление водителя по id в БД.*/
  it('DELETE /api/drivers/:id and check after NOT FOUND', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .send({ ...testDriverData, name: 'Another Driver5' })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/api/drivers/${createdDriverId}`)
      .expect(HttpStatus.NoContent);

    const driverResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    expect(driverResponse.status).toBe(HttpStatus.NotFound);
  });
});
