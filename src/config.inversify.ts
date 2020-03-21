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
import {AccountsRepositoryI} from "./core/account";
import {AccountsRepository} from "./repository/accountsRepository";

let container = new Container();

container.bind<AccountsRepositoryI>(TYPES.AccountsRepository).to(AccountsRepository);

// COMPANIES
container.bind<CompaniesRepositoryI>(TYPES.CompaniesRepository).to(CompaniesRepository);
container.bind<CompaniesServiceI>(TYPES.CompaniesService).to(CompaniesService);
container.bind<CompaniesController>(TYPES.CompaniesController).to(CompaniesController);

// BONDS
container.bind<BondsRepositoryI>(TYPES.BondsRepository).to(BondsRepository);
container.bind<BondsServiceI>(TYPES.BondsService).to(BondsService);
container.bind<BondsController>(TYPES.BondsController).to(BondsController);

// PAYMENTS
container.bind<PaymentsRepositoryI>(TYPES.PaymentsRepository).to(PaymentsRepository);
container.bind<PaymentsServiceI>(TYPES.PaymentsService).to(PaymentsService);
container.bind<PaymentsController>(TYPES.PaymentsController).to(PaymentsController);

export default container;

