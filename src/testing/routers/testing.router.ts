import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';

/*Создаем роутер из Express для тестирования приложения.*/
export const testingRouter = Router({});

/*Конфигурируем роутер "testingRouter".*/
testingRouter
  /*DELETE-запрос для очистки БД с данными по водителям для целей тестирования.*/
  .delete('/all-data', (req: Request, res: Response) => {
    db.drivers = [];
    res.sendStatus(HttpStatus.NoContent);
  })

  /*GET-запрос для получения тестового сообщения.*/
  .get('/testing', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('testing url');
  });
