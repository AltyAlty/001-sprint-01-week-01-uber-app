import express, { Express, Request, Response } from 'express';
import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { HttpStatus } from './core/types/http-statuses';
import { setupSwagger } from './core/swagger/setup-swagger';

/*Создаем функцию "setupApp()" для конфигурирования экземпляров приложения Express.*/
export const setupApp = (app: Express) => {
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());

  /*GET-запрос для получения главной страницы.*/
  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello World!');
  });

  /*Подключаем роутеры.*/
  app.use('/api/drivers', driversRouter);
  app.use('/api/testing', testingRouter);

  /*Инициализируем документацию Swagger.*/
  setupSwagger(app);
  return app;
};
