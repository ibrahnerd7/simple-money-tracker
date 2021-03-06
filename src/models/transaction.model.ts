import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Wallet} from './wallet.model';
import {Category} from './category.model';

@model()
export class Transaction extends Entity {
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
    type: 'string',
    required: true,
  })
  note: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'boolean',
    required: true,
  })
  is_expense: boolean;

  @belongsTo(() => Wallet)
  walletId: string;

  @belongsTo(() => Category)
  categoryId: string;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
