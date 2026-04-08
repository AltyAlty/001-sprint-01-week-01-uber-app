import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { vehicleInputDtoValidation } from '../validation/vehicleInputDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Driver } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { HttpStatus } from '../../core/types/http-statuses';

/*Создаем роутер из Express для работы с данными по водителям.*/
export const driversRouter = Router({});

/*Конфигурируем роутер "driversRouter".*/
driversRouter
  /*GET-запрос для получения данных по всем водителям.*/
  .get('', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send(db.drivers);
  })

  /*GET-запрос для поиска водителя по id при помощи URI-параметров. При помощи ":" Express позволяет указывать
  переменные в пути. Такие переменные доступны через объект "req.params".

  "Request" из Express используется для типизации параметра "req", а "Response" из Express используется для типизации
  параметра "res".

  Типизация первого параметра "req" второго параметра в виде асинхронной функции методов "get()", "post()", "delete()" и
  "put()" внутри роутеров из Express:
  1. На первом месте в типе идут URI-параметры.
  2. На втором месте в типе идет "ResBody". Относится к параметру "res" внутри запроса, то есть что будет возвращено.
  3. На третьем месте в типе идет "ReqBody". Это то, что приходит в body в запросе.
  4. На четвертом месте в типе идут Query-параметры.*/
  .get(
    '/:id',
    (
      req: Request<{ id: string }, Driver, {}, {}>,
      res: Response<Driver | null | unknown>,
    ) => {
      /*Ищем водителя в БД. Метод "parseInt()" возвращает целое число на основе параметра.*/
      const id = parseInt(req.params.id);
      const driver = db.drivers.find((d) => d.id === id);

      /*Если водитель не был найден, то сообщаем об этом клиенту.*/
      if (!driver) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      /*Если водитель был найден, то сообщаем об этом клиенту.*/
      res.status(HttpStatus.Ok).send(driver);
    },
  )

  /*POST-запрос для добавления нового водителя.*/
  .post('', (req: Request<{}, {}, DriverInputDto>, res: Response) => {
    /*Проводим валидацию DTO для входных данных по новому водителю.*/
    const errors = vehicleInputDtoValidation(req.body);

    /*Если были ошибки валидации, то сообщаем об этом клиенту.*/
    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    /*Если ошибок валидации не было, то создаем объект с данными нового водителя.*/
    const newDriver: Driver = {
      /*Генерация случайного id.*/
      id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      vehicleYear: req.body.vehicleYear,
      vehicleLicensePlate: req.body.vehicleLicensePlate,
      vehicleDescription: req.body.vehicleDescription,
      vehicleFeatures: req.body.vehicleFeatures,
      createdAt: new Date(),
    };

    /*Добавляем нового водителя в БД и сообщаем об этом клиенту.*/
    db.drivers.push(newDriver);
    res.status(HttpStatus.Created).send(newDriver);
  })

  /*PUT-запрос для изменения данных водителя по id при помощи URI-параметров.*/
  .put(
    '/:id',
    (req: Request<{ id: string }, {}, Driver, {}>, res: Response) => {
      /*Ищем водителя в БД.*/
      const id = parseInt(req.params.id);
      const index = db.drivers.findIndex((v) => v.id === id);

      /*Если водитель не был найден, то сообщаем об этом клиенту.*/
      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: 'id', message: 'Vehicle not found' },
            ]),
          );

        return;
      }

      /*Если водитель был найден, то проводим валидацию DTO для входных данных по водителю, которого нужно изменить.*/
      const errors = vehicleInputDtoValidation(req.body);

      /*Если были ошибки валидации, то сообщаем об этом клиенту.*/
      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
      }

      /*Если ошибок валидации не было, то обновляем данные водителя в БД и сообщаем об этом клиенту.*/
      const driver = db.drivers[index];
      driver.name = req.body.name;
      driver.phoneNumber = req.body.phoneNumber;
      driver.email = req.body.email;
      driver.vehicleMake = req.body.vehicleMake;
      driver.vehicleModel = req.body.vehicleModel;
      driver.vehicleYear = req.body.vehicleYear;
      driver.vehicleLicensePlate = req.body.vehicleLicensePlate;
      driver.vehicleDescription = req.body.vehicleDescription;
      driver.vehicleFeatures = req.body.vehicleFeatures;
      res.sendStatus(HttpStatus.NoContent);
    },
  )

  /*DELETE-запрос для удаления водителя по id при помощи URI-параметров.*/
  .delete('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    /*Ищем водителя в БД.*/
    const id = parseInt(req.params.id);
    const index = db.drivers.findIndex((v) => v.id === id);

    /*Если водитель не был найден, то сообщаем об этом клиенту.*/
    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );
      return;
    }

    /*Если водитель был найден, то удаляем его из БД и сообщаем об этом клиенту.*/
    db.drivers.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
