// import { Express } from 'express';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

// /*Создаем объект, описывающий опции документации Swagger.*/
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',

//     info: {
//       title: 'Uber API',
//       version: '1.0.0',
//       description: 'uber API',
//     },
//   },

//   /*Указываем откуда брать документацию для Swagger. В данном случае все файлы .yml в папке "src".*/
//   apis: ['./src/**/*.swagger.yml'],
// };

// /*Генерируем документацию API в формате Swagger.*/
// const swaggerSpec = swaggerJsdoc(swaggerOptions);

// /*Создаем функцию "setupSwagger()" для инициализации документации Swagger.*/
// export const setupSwagger = (app: Express) => {
//   app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// };

/*Версия, чтобы отображался UI от Swagger, файлы .yaml все равно будут проигнорированы.*/
// export const setupSwagger = (app: Express) => {
//   app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
//
//   app.use(
//     '/api',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec, {
//       swaggerOptions: { url: '/swagger.json' },
//       customCssUrl: 'https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css',
//       customJs: [
//         'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js',
//         'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-standalone-preset.js',
//       ],
//     }),
//   );
// };

import path from 'path';
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Uber API',
      version: '1.0.0',
      description: 'uber API',
    },
  },

  apis: [path.resolve(process.cwd(), 'src/**/*.swagger.yml')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.get('/swagger.json', (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use(
    '/api',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: '/swagger.json' },
      customCssUrl: 'https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-standalone-preset.js',
      ],
    }),
  );
};
