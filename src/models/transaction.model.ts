import {Entity, model, property} from '@loopback/repository';

@model()
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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


  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;