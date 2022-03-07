import { CustomersRepositoryInMemory } from '../orm/in-memory/repositories';
// import { OrdersRepositorySequelize } from '../orm/sequelize/repositories';

import * as constants from '../../../config/constants';

import { ICustomersGateway } from '../../../core/use-cases/interfaces';
import { RepositoryFactory } from './interfaces';

export default class CustomersRepositoryFactory extends RepositoryFactory<ICustomersGateway> {
  public create(dbDialect: string): ICustomersGateway {
    const { dbDialects } = constants;

    const customersRepositoryMakerByDialect = {
      // [dbDialects.MARIA_DB]: () => new OrdersRepositorySequelize(),
      [dbDialects.IN_MEMORY]: () => new CustomersRepositoryInMemory()
    };

    const repositoryMaker = this.selectRepositoryMaker(
      customersRepositoryMakerByDialect,
      dbDialect
    );

    return repositoryMaker();
  }
}
