import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {SimpleMoneyTrackerDataSource} from '../datasources';
import {User, UserRelations, Wallet} from '../models';
import {WalletRepository} from './wallet.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly wallets: HasManyRepositoryFactory<Wallet, typeof User.prototype.id>;

  constructor(
    @inject('datasources.SimpleMoneyTracker') dataSource: SimpleMoneyTrackerDataSource, @repository.getter('WalletRepository') protected walletRepositoryGetter: Getter<WalletRepository>,
  ) {
    super(User, dataSource);
    this.wallets = this.createHasManyRepositoryFactoryFor('wallets', walletRepositoryGetter,);
    this.registerInclusionResolver('wallets', this.wallets.inclusionResolver);
  }
}
