import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'SimpleMoneyTracker',
  connector: 'postgresql',
  url: '',
  host: 'app-3bc52a7b-731a-44ff-b94f-29ad936ee622-do-user-4431621-0.b.db.ondigitalocean.com',
  port: 25060,
  user: 'simple-money-tracker',
  password: 'ok927eemg19z5ky5',
  database: 'simple-money-tracker'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SimpleMoneyTrackerDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'SimpleMoneyTracker';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.SimpleMoneyTracker', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
