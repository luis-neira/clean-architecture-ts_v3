import { Result } from '../../lib/result';
import { ValidationError } from '@common/errors';
import { ValueNotFoundError } from '../../../common/errors';

import { IUseCaseInputBoundary, IUseCaseOutputBoundary } from '../interfaces';
import {
  IOrdersGateway,
  EntityGatewayDictionary,
  IUpdateOrderRequestModel,
} from '../interfaces';

import { RelationValidator } from './relations-validator';

export default class UpdateOrderUseCase
  implements IUseCaseInputBoundary
{
  private ordersRepository: IOrdersGateway;
  private presenter: IUseCaseOutputBoundary;
  private validateRelations: RelationValidator;

  public constructor(
    reposByResource: EntityGatewayDictionary,
    presenter: IUseCaseOutputBoundary,
  ) {
    this.ordersRepository = reposByResource.orders;
    this.presenter = presenter;
    this.validateRelations = new RelationValidator(reposByResource.products, reposByResource.users)
  }

  public async execute({
    id,
    orderDetails
  }: IUpdateOrderRequestModel): Promise<void> {
    try {
    const {
      errors,
      data,
      relationsDictionary
    } = await this.validateRelations.validate(orderDetails);
    
    if (errors.length > 0) {
      const invalid = new ValidationError('Validation Errors');
      invalid.reason = 'Bad data';
      invalid.validationErrors = errors;
      throw invalid;
    }

    const updatedOrder = await this.ordersRepository.update(data, {
      id,
      relations: relationsDictionary
    });

    if (updatedOrder === null) {
      throw new ValueNotFoundError(`orderId '${id}' not found`);
    }

    const savedOrder = await this.ordersRepository.save(updatedOrder);

    this.presenter.execute(savedOrder.toJSON());
    } catch (err: any) {
      if (err.isFailure) throw err;

      throw Result.fail(err);
    }
  }
}
