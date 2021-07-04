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
} from '@loopback/rest';
import {
  Wallet,
  Transaction,
} from '../models';
import {WalletRepository} from '../repositories';

export class WalletTransactionController {
  constructor(
    @repository(WalletRepository) protected walletRepository: WalletRepository,
  ) { }

  @get('/wallets/{id}/transactions', {
    responses: {
      '200': {
        description: 'Array of Wallet has many Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Transaction)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: string,
    @param.query.object('filter') filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    return this.walletRepository.transactions(id).find(filter);
  }

  @post('/wallets/{id}/transactions', {
    responses: {
      '200': {
        description: 'Wallet model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Wallet.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransactionInWallet',
            exclude: ['id'],
            optional: ['walletId']
          }),
        },
      },
    }) transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    return this.walletRepository.transactions(id).create(transaction);
  }

  @patch('/wallets/{id}/transactions', {
    responses: {
      '200': {
        description: 'Wallet.Transaction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Partial<Transaction>,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.walletRepository.transactions(id).patch(transaction, where);
  }

  @del('/wallets/{id}/transactions', {
    responses: {
      '200': {
        description: 'Wallet.Transaction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.walletRepository.transactions(id).delete(where);
  }
}
