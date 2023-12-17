import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardEntity } from 'src/boards/entities/board.entity';
import { ListEntity } from 'src/lists/entities/list.entity';
import { TaskEntity } from 'src/tasks/entities/task.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

ConfigModule.forRoot({
  envFilePath: `.develop.env`,
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  entities: [UserEntity, BoardEntity, ListEntity, TaskEntity],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  database: configService.get('DB_NAME'),
  synchronize: false,
  migrationsRun: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDS = new DataSource(DataSourceConfig);
