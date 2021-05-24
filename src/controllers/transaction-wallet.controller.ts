import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Transaction,
  Wallet,
} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionWalletController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) { }

  @get('/transactions/{id}/wallet', {
    responses: {
      '200': {
        description: 'Wallet belonging to Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Wallet)},
          },
        },
      },
    },
  })
  async getWallet(
    @param.path.number('id') id: typeof Transaction.prototype.id,
  ): Promise<Wallet> {
    return this.transactionRepository.wallet(id);
  }
}
