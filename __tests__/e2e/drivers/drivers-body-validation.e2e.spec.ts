import request from 'supertest';
import express from 'express';
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
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
  });

  /*Описываем тест, проверяющий отказ в добавлении водителя с непрошедшими валидацию данными.*/
  it('should not create driver when incorrect body passed; POST /drivers', async () => {
    const invalidDataSet1 = await request(app)
      .post('/drivers')
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
  });
});
