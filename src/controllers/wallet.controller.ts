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

  @get('/wallets/count')
  @response(200, {
    description: 'Wallet model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Wallet) where?: Where<Wallet>,
  ): Promise<Count> {
    return this.walletRepository.count(where);
  }

  @get('/wallets')
  @response(200, {
    description: 'Array of Wallet model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Wallet, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Wallet) filter?: Filter<Wallet>,
  ): Promise<Wallet[]> {
    return this.walletRepository.find(filter);
  }

  @patch('/wallets')
  @response(200, {
    description: 'Wallet PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {partial: true}),
        },
      },
    })
    wallet: Wallet,
    @param.where(Wallet) where?: Where<Wallet>,
  ): Promise<Count> {
    return this.walletRepository.updateAll(wallet, where);
  }

  @get('/wallets/{id}')
  @response(200, {
    description: 'Wallet model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Wallet, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Wallet, {exclude: 'where'}) filter?: FilterExcludingWhere<Wallet>
  ): Promise<Wallet> {
    return this.walletRepository.findById(id, filter);
  }

  @patch('/wallets/{id}')
  @response(204, {
    description: 'Wallet PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wallet, {partial: true}),
        },
      },
    })
    wallet: Wallet,
  ): Promise<void> {
    await this.walletRepository.updateById(id, wallet);
  }

  @put('/wallets/{id}')
  @response(204, {
    description: 'Wallet PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() wallet: Wallet,
  ): Promise<void> {
    await this.walletRepository.replaceById(id, wallet);
  }

  @del('/wallets/{id}')
  @response(204, {
    description: 'Wallet DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.walletRepository.deleteById(id);
  }
}
