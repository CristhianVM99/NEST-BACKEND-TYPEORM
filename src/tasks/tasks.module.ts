import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TaskEntity } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from 'src/lists/entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, ListEntity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
