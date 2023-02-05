import { Image } from '../../entities';
import { IUser, IProduct, IOrder } from '@core/entities/interfaces';

type CoreEntityData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>;

interface IWrite<T extends object> {
  create(input: CoreEntityData<T>): T;
  update(entity: T, input: Record<string, any>): T;
  
  save(entity: T | T[]): Promise<T>;
  remove(id: string): Promise<true | null>;
}

interface IRead<T extends object> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T | null>;
}

export default interface IEntityGateway extends IWrite<any>, IRead<any> {}

export interface IUsersGateway extends IWrite<IUser>, IRead<IUser> {
  findAllUsersWithOrders(): Promise<IUser[]>
  findOneUserWithOrder(id: string): Promise<IUser | null>
}

export interface IProductsGateway extends IWrite<IProduct>, IRead<IProduct> {
  findAllProductsWithOrders(): Promise<IProduct[]>
  findOneProductWithOrder(id: string): Promise<IProduct | null>
}

export interface IOrdersGateway extends IWrite<IOrder>, IRead<IOrder> {
  findAllOrdersWithProductsAndUser(): Promise<IOrder[]>
  findOneOrderWithProductsAndUser(id: string): Promise<IOrder | null>
}

export interface IImagesGateway extends Omit<IWrite<Image>, 'create'>, IRead<Image> {}

export interface EntityGatewayDictionary {
  users: IUsersGateway;
  products: IProductsGateway;
  orders: IOrdersGateway;
  images?: IImagesGateway;
};
