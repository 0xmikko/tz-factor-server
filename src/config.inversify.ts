import {Container} from 'inversify';
import {TYPES} from './types';

// Issuers
import {CompaniesRepositoryI, CompaniesServiceI} from './core/company';
import {CompaniesService} from './services/companiesService';
import {CompaniesRepository} from './repository/companiesRepository';
import {CompaniesController} from './controllers/companiesController';

// Bonds


let container = new Container();

container.bind<CompaniesRepositoryI>(TYPES.CompaniesRepository).to(CompaniesRepository);
container.bind<CompaniesServiceI>(TYPES.CompaniesService).to(CompaniesService);
container.bind<CompaniesController>(TYPES.CompaniesController).to(CompaniesController);

export default container;
