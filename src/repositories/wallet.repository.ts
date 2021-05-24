import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {SimpleMoneyTrackerDataSource} from '../datasources';
import {Wallet, WalletRelations, User, Transaction} from '../models';
import {UserRepository} from './user.repository';
import {TransactionRepository} from './transaction.repository';

export class WalletRepository extends DefaultCrudRepository<
  Wallet,
  typeof Wallet.prototype.id,
  WalletRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Wallet.prototype.id>;

  public readonly transactions: HasManyRepositoryFactory<Transaction, typeof Wallet.prototype.id>;

  constructor(
    @inject('datasources.SimpleMoneyTracker') dataSource: SimpleMoneyTrackerDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>,
  ) {
    super(Wallet, dataSource);
    this.transactions = this.createHasManyRepositoryFactoryFor('transactions', transactionRepositoryGetter,);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
