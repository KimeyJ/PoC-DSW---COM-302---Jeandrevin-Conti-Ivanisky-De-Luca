import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'poc_MikroORM_SQL',
  driver: MySqlDriver,
  driverOptions: {
    host: 'localhost',
    port: 3306,
    user: 'kimey',
    password: 'kimey',
    dbName: 'poc_MikroORM_SQL',
  },
  clientUrl: 'mysql://kimey:kimey@localhost:3306/poc_MikroORM_SQL',
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();

  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();
};
