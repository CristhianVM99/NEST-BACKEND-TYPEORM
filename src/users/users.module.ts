import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, BoardEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
