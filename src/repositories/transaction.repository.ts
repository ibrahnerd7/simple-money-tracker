import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SimpleMoneyTrackerDataSource} from '../datasources';
import {Transaction, TransactionRelations, Wallet} from '../models';
import {WalletRepository} from './wallet.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly wallet: BelongsToAccessor<Wallet, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.SimpleMoneyTracker') dataSource: SimpleMoneyTrackerDataSource, @repository.getter('WalletRepository') protected walletRepositoryGetter: Getter<WalletRepository>,
  ) {
    super(Transaction, dataSource);
    this.wallet = this.createBelongsToAccessorFor('wallet', walletRepositoryGetter,);
    this.registerInclusionResolver('wallet', this.wallet.inclusionResolver);
  }
}
