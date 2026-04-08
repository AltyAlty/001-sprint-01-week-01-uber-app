import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';

/*Описываем тестовый набор.*/
describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  /*Описываем тест, проверяющий отказ в добавлении водителя с непрошедшими валидацию данными.*/
  it('should not create driver when incorrect body passed; POST /api/drivers', async () => {
    const invalidDataSet1 = await request(app)
      .post('/api/drivers')
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/api/drivers')
      .send({
        ...correctTestDriverData,
        phoneNumber: '',
        vehicleModel: '',
        vehicleYear: 'year',
        vehicleLicensePlate: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/api/drivers')
      .send({
        ...correctTestDriverData,
        name: 'A',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverListResponse = await request(app).get('/api/drivers');
    expect(driverListResponse.body).toHaveLength(0);
  });

  /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными.*/
  it('should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        phoneNumber: '',
        vehicleModel: '',
        vehicleYear: 'year',
        vehicleLicensePlate: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        name: 'A',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными о фичах машины.*/
  it('should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const {
      body: { id: createdDriverId },
    } = await request(app)
      .post('/api/drivers')
      .send({ ...correctTestDriverData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/api/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'invalid-feature',
          VehicleFeature.WiFi,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await request(app).get(
      `/api/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });
});
