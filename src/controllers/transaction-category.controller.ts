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
  Category,
} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionCategoryController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
  ) { }

  @get('/transactions/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.number('id') id: typeof Transaction.prototype.id,
  ): Promise<Category> {
    return this.transactionRepository.category(id);
  }
}
