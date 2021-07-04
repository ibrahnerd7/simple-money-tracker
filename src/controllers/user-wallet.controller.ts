import { inject } from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
  RestBindings,
  Response,
} from '@loopback/rest';
import {
  User,
  Wallet,
} from '../models';
import {UserRepository} from '../repositories';

export class UserWalletController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) { }

  @get('/users/{id}/wallets', {
    responses: {
      '200': {
        description: 'Array of User has many Wallet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Wallet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: string,
    @param.query.object('filter') filter?: Filter<Wallet>,
  ): Promise<Response> {
    const wallets:Wallet[]=await this.userRepository.wallets(id).find(filter);
    const totalBalance=wallets.map(wallet=>wallet.balance).reduce((prev,next )=>prev! + next!);
    this.response.status(200).send({
        wallets,
        totalBalance
    })
    return this.response;
  }

  @post('/users/{id}/wallets', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {
            title: 'NewWalletInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) wallet: Omit<Wallet, 'id'>,
  ): Promise<Wallet> {
    return this.userRepository.wallets(id).create(wallet);
  }

  @patch('/users/{id}/wallets', {
    responses: {
      '200': {
        description: 'User.Wallet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {partial: true}),
        },
      },
    })
    wallet: Partial<Wallet>,
    @param.query.object('where', getWhereSchemaFor(Wallet)) where?: Where<Wallet>,
  ): Promise<Count> {
    return this.userRepository.wallets(id).patch(wallet, where);
  }

  @del('/users/{id}/wallets', {
    responses: {
      '200': {
        description: 'User.Wallet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Wallet)) where?: Where<Wallet>,
  ): Promise<Count> {
    return this.userRepository.wallets(id).delete(where);
  }
}
