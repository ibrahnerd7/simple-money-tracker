import { inject } from '@loopback/context';
import { LoggingBindings, WinstonLogger } from '@loopback/logging';
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
  HttpErrors,
} from '@loopback/rest';
import {Transaction, Wallet} from '../models';
import {TransactionRepository, WalletRepository} from '../repositories';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository : TransactionRepository,
    @repository(WalletRepository)
    public walletRepository:WalletRepository
  ) {}
 

  @post('/transactions')
  @response(200, {
    description: 'Transaction model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransaction',
            exclude: ['id','created_at'],
          }),
        },
      },
    })
    transaction: Omit<Transaction,'id'>,
  ): Promise<Transaction | undefined>  {
    const wallet:Wallet=await this.walletRepository.findById(transaction.walletId);

    const currentBalance= wallet.balance || 0;
    const transactionAmount=transaction.amount;
    let canDeduct=currentBalance-transactionAmount >= 0;

    if(transaction.is_expense && canDeduct)return this.updateBalance(true,currentBalance,transactionAmount,transaction,transaction.walletId);

    else if(transaction.is_expense && !canDeduct)throw new HttpErrors.BadRequest('You can\'t spending more than you have in your wallet.');

    else return this.updateBalance(false,currentBalance,transactionAmount,transaction,transaction.walletId);
  }

  async updateBalance(
    isExpense:boolean,currentBalance:number,
    transactionAmount:number, transaction:Transaction,
     walletId:string):Promise<Transaction | undefined>{
    const finalBalance=isExpense? currentBalance  - transactionAmount : currentBalance  + transactionAmount;
    const response=  this.transactionRepository.create(transaction);
    await this.walletRepository.updateById(walletId,{balance:finalBalance});
    return response;
  }

  @get('/transactions')
  @response(200, {
    description: 'Array of Transaction model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transaction),
        },
      },
    },
  })
  async find(
  ): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  @get('/transactions/{id}')
  @response(200, {
    description: 'Transaction model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transaction),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Transaction> {
    return this.transactionRepository.findById(id);
  }

  @patch('/transactions/{id}')
  @response(200, {
    description: 'Transaction PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true, exclude: ['id','walletId','categoryId'],}),
        },
      },
    })
    transaction: Transaction,
  ): Promise<void> {
    await this.transactionRepository.updateById(id, transaction);
  }

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

  @del('/transactions/{id}')
  @response(200, {
    description: 'Transaction DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionRepository.deleteById(id);
  }
}
