import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {Transaction} from './transaction.model';

@model()
export class Wallet extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'number',
    default: 0,
  })
  balance?: number;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Transaction)
  transactions: Transaction[];

  constructor(data?: Partial<Wallet>) {
    super(data);
  }
}

export interface WalletRelations {
  // describe navigational properties here
}

export type WalletWithRelations = Wallet & WalletRelations;
