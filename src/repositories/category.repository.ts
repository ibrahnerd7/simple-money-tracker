import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SimpleMoneyTrackerDataSource} from '../datasources';
import {Category, CategoryRelations} from '../models';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {
  constructor(
    @inject('datasources.SimpleMoneyTracker') dataSource: SimpleMoneyTrackerDataSource,
  ) {
    super(Category, dataSource);
  }
}
