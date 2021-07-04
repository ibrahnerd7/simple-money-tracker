import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Wallet} from '../models';
import {WalletRepository} from '../repositories';

export class WalletController {
  constructor(
    @repository(WalletRepository)
    public walletRepository : WalletRepository,
  ) {}

  @post('/wallets')
  @response(200, {
    description: 'Wallet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Wallet)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {
            title: 'NewWallet',
            exclude: ['id'],
          }),
        },
      },
    })
    wallet: Omit<Wallet, 'id'>,
  ): Promise<Wallet> {
    return this.walletRepository.create(wallet);
  }

  @get('/wallets')
  @response(200, {
    description: 'Array of Wallet model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Wallet),
        },
      },
    },
  })
  async find(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  @get('/wallets/{id}')
  @response(200, {
    description: 'Wallet model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Wallet),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string
  ): Promise<Wallet> {
    return this.walletRepository.findById(id);
  }

  @patch('/wallets/{id}')
  @response(200, {
    description: 'Wallet PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {partial: true, exclude: ['id','userId','balance','created_at']}),
        },
      },
    })
    wallet: Wallet,
  ): Promise<void> {
    await this.walletRepository.updateById(id, wallet);
  }

  @del('/wallets/{id}')
  @response(200, {
    description: 'Wallet DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.walletRepository.deleteById(id);
  }
}
