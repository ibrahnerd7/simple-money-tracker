import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SimpleMoneyTrackerDataSource} from '../datasources';
import {Transaction, TransactionRelations, Wallet, Category} from '../models';
import {WalletRepository} from './wallet.repository';
import {CategoryRepository} from './category.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly wallet: BelongsToAccessor<Wallet, typeof Transaction.prototype.id>;

  public readonly category: BelongsToAccessor<Category, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.SimpleMoneyTracker') dataSource: SimpleMoneyTrackerDataSource, @repository.getter('WalletRepository') protected walletRepositoryGetter: Getter<WalletRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Transaction, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.wallet = this.createBelongsToAccessorFor('wallet', walletRepositoryGetter,);
    this.registerInclusionResolver('wallet', this.wallet.inclusionResolver);
  }
}
