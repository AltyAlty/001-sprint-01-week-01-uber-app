import express, { Express, Request, Response } from 'express';
import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { HttpStatus } from './core/types/http-statuses';

export const setupApp = (app: Express) => {
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());

  /*GET-запрос для получения главной страницы.*/
  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello World!');
  });

  /*Подключаем роутеры.*/
  app.use('/drivers', driversRouter);
  app.use('/testing', testingRouter);

  return app;
};
