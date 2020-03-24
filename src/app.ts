import {ConfigParams} from './config/config';
import express, {Application} from 'express';
import cors from 'cors';
import {createConnection} from 'typeorm';
import {CompaniesController} from './controllers/companiesController';
import {morganLogger} from './middleware/logger';
import container from './config.inversify';
import {SocketRouter} from './controllers/socketRouter';
import {BondsController} from './controllers/bondsController';
import {TYPES} from "./types";
import {PaymentsController} from "./controllers/paymentsController";
import {AccountsController} from "./controllers/accountsController";

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
          // 'build/core/*.js',
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

  let server = require('http').Server(app);

  // set up socket.io and bind it to our
  // http server.
  let io = require('socket.io').listen(server, {origins: '*:*'});

  try {

    const accountsController = container.get<AccountsController>(
        TYPES.AccountsController,
    );
    const companiesController = container.get<CompaniesController>(
      TYPES.CompaniesController,
    );
    const bondsController = container.get<BondsController>(
      TYPES.BondsController,
    );
    const paymentsController = container.get<PaymentsController>(
        TYPES.PaymentsController,
    );

    const socketRouter = new SocketRouter([
        accountsController,
      companiesController,
      bondsController,
      paymentsController
    ]);
    socketRouter.connect(io);
  } catch (e) {
    console.log('Cant start controllers', e);
  }

  return server;
}
