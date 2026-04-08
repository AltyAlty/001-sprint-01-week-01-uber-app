import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/*Создаем объект, описывающий опции документации Swagger.*/
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Uber API',
      version: '1.0.0',
      description: 'uber API',
    },
  },

  /*Указываем откуда брать документацию для Swagger. В данном случае все файлы .yml в папке "src".*/
  // apis: ['./src/**/*.swagger.yml'],
  apis:
    process.env.VERCEL || process.env.NODE_ENV === 'production'
      ? [`${process.cwd()}/dist/**/*.swagger.yml`]
      : [`${process.cwd()}/src/**/*.swagger.yml`],
};

/*Генерируем документацию API в формате Swagger.*/
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/*Создаем функцию "setupSwagger()" для инициализации документации Swagger.*/
// export const setupSwagger = (app: Express) => {
//   app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// };

export const setupSwagger = (app: Express) => {
  // 1. отдаём саму спеку
  app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));

  // 2. UI, который тянет assets с unpkg
  app.use(
    '/api',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: { url: '/swagger.json' },
      customCssUrl: 'https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@latest/swagger-ui-standalone-preset.js',
      ],
    }),
  );
};
