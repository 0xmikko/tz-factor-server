import {Container} from 'inversify';
// Companies
import {CompaniesRepositoryI, CompaniesServiceI} from './core/company';
import {CompaniesService} from './services/companiesService';
import {CompaniesRepository} from './repository/companiesRepository';
import {CompaniesController} from './controllers/companiesController';
// Bonds
import {BondsRepositoryI, BondsServiceI} from "./core/bonds";
import {BondsController} from "./controllers/bondsController";
import {BondsRepository} from "./repository/bondsRepository";
import {BondsService} from "./services/bondsService";
// Payments
import {PaymentsRepositoryI, PaymentsServiceI} from "./core/payments";
import {PaymentsService} from "./services/paymentsService";
import {PaymentsRepository} from "./repository/paymentsRepository";
import {PaymentsController} from "./controllers/paymentsController";
import {TYPES} from "./types";
import {AccountsRepositoryI, AccountsServiceI} from "./core/accounts";
import {AccountsRepository} from "./repository/accountsRepository";
import {AccountsController} from "./controllers/accountsController";
import {AccountsService} from "./services/accountsService";
import {OffersRepositoryI, OffersServiceI} from "./core/offers";
import {OffersRepository} from "./repository/offersRepository";
import {OffersService} from "./services/offersService";
import {OffersController} from "./controllers/offersController";

let container = new Container();

// ACCOUNTS
container.bind<AccountsRepositoryI>(TYPES.AccountsRepository).to(AccountsRepository).inSingletonScope();
container.bind<AccountsServiceI>(TYPES.AccountsService).to(AccountsService);
container.bind<AccountsController>(TYPES.AccountsController).to(AccountsController);

// COMPANIES
container.bind<CompaniesRepositoryI>(TYPES.CompaniesRepository).to(CompaniesRepository);
container.bind<CompaniesServiceI>(TYPES.CompaniesService).to(CompaniesService);
container.bind<CompaniesController>(TYPES.CompaniesController).to(CompaniesController);

// BONDS
container.bind<BondsRepositoryI>(TYPES.BondsRepository).to(BondsRepository).inSingletonScope();
container.bind<BondsServiceI>(TYPES.BondsService).to(BondsService);
container.bind<BondsController>(TYPES.BondsController).to(BondsController);

// PAYMENTS
container.bind<PaymentsRepositoryI>(TYPES.PaymentsRepository).to(PaymentsRepository).inSingletonScope();
container.bind<PaymentsServiceI>(TYPES.PaymentsService).to(PaymentsService);
container.bind<PaymentsController>(TYPES.PaymentsController).to(PaymentsController);

// OFFERS
container.bind<OffersRepositoryI>(TYPES.OffersRepository).to(OffersRepository).inSingletonScope();
container.bind<OffersServiceI>(TYPES.OffersService).to(OffersService);
container.bind<OffersController>(TYPES.OffersController).to(OffersController);

export default container;

