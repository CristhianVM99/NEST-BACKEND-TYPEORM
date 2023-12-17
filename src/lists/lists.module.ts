import { Module } from '@nestjs/common';
import { ListsService } from './services/lists.service';
import { ListsController } from './controllers/lists.controller';
import { ListEntity } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/tasks/entities/task.entity';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity, TaskEntity, BoardEntity])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
