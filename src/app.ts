import {ConfigParams} from './config/config';
import express, {Application} from 'express';
import cors from 'cors';
import {createConnection} from 'typeorm';
import {CompaniesController} from './controllers/companiesController';
import {morganLogger} from './middleware/logger';

import {SocketRouter} from './controllers/socketRouter';
import {BondsController} from './controllers/bondsController';
import {PaymentsController} from './controllers/paymentsController';
import {AccountsController} from './controllers/accountsController';
import container from './config.inversify';
import {TYPES} from './types';
import {OffersController} from './controllers/offersController';

export function createApp(config: ConfigParams): Promise<Application> {
  return new Promise<Application>(async resolve => {
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
          'src/core/*.ts',
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
    app.get("/", (req, res) => {
      res.status(200).send("It works!")
    })

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

      const offersController = container.get<OffersController>(
        TYPES.OffersController,
      );
      const socketRouter = new SocketRouter([
        accountsController,
        companiesController,
        bondsController,
        paymentsController,
        offersController,
      ]);
      socketRouter.connect(io);
      await socketRouter.update();
    } catch (e) {
      console.log('Cant start controllers', e);
    }

    resolve(server);
  });
}
