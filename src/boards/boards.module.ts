import { Module } from '@nestjs/common';
import { BoardsService } from './services/boards.service';
import { BoardsController } from './controllers/boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from './entities/board.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { ListEntity } from 'src/lists/entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, UsersEntity, ListEntity])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
