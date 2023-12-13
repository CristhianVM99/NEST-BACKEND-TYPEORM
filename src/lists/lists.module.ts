import { Module } from '@nestjs/common';
import { ListsService } from './services/lists.service';
import { ListsController } from './controllers/lists.controller';
import { ListEntity } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
