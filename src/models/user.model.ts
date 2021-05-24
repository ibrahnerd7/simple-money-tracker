import {Entity, model, property, hasMany} from '@loopback/repository';
import {Wallet} from './wallet.model';

@model()
export class User extends Entity {
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
  first_name: string;

  @property({
    type: 'string',
  })
  middle_name?: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  photo_url?: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @hasMany(() => Wallet)
  wallets: Wallet[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
