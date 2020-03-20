import {Container} from 'inversify';
import {TYPES} from './types';

// Issuers
import {CompaniesRepositoryI, CompaniesServiceI} from './core/company';
import {CompaniesService} from './services/companiesService';
import {CompaniesRepository} from './repository/companiesRepository';
import {CompaniesController} from './controllers/companiesController';
import {BondsRepositoryI, BondsServiceI} from "./core/bonds";
import {BondsController} from "./controllers/bondsController";
import {BondsRepository} from "./repository/bondsRepository";
import {BondsService} from "./services/bondsService";

// Bonds


let container = new Container();

// COMPANIES
container.bind<CompaniesRepositoryI>(TYPES.CompaniesRepository).to(CompaniesRepository);
container.bind<CompaniesServiceI>(TYPES.CompaniesService).to(CompaniesService);
container.bind<CompaniesController>(TYPES.CompaniesController).to(CompaniesController);

// BONDS
container.bind<BondsRepositoryI>(TYPES.BondsRepository).to(BondsRepository);
container.bind<BondsServiceI>(TYPES.BondsService).to(BondsService);
container.bind<BondsController>(TYPES.BondsController).to(BondsController);

export default container;
