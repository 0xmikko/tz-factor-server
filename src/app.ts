import {ConfigParams} from './config/config';
import express, {Application} from 'express';
import cors from 'cors';
import {createConnection} from 'typeorm';
import {CompaniesController} from './controllers/companiesController';
import {morganLogger} from './middleware/logger';
import {TYPES} from './types';
import container from './config.inversify';
import {SocketRouter} from './controllers/socketRouter';
import {BondsController} from './controllers/bondsController';

export async function createApp(config: ConfigParams): Promise<Application> {
  // Connecting Database
  try {
    await createConnection({
      type: 'postgres',
      url: config.database_url,
      extra: {
        ssl: true,
        rejectUnauthorized: false,
      },
      entities: [
          'build/core/*.js',
       'src/core/*.ts'
      ],
    });
  } catch (e) {
    console.log('TypeORM connection error: ', e);
  }

  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
  );

  app.use(morganLogger);

  app.get('/a/', (req, res) => {
    console.log('QQQ');
    res.status(200);
    res.send('Q-dQ');
  });

  let server = require('http').Server(app);

  // set up socket.io and bind it to our
  // http server.
  let io = require('socket.io').listen(server, {origins: '*:*'});

  try {
    const companiesController = container.get<CompaniesController>(
      TYPES.CompaniesController,
    );
    const bondsController = container.get<BondsController>(
      TYPES.BondsController,
    );
    const socketRouter = new SocketRouter([
      companiesController,
      bondsController,
    ]);
    socketRouter.connect(io);
  } catch (e) {
    console.log('Cant start controllers', e);
  }

  return server;
}
