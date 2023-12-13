import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersEntity } from '../entities/user.entity';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  public async findUsers(): Promise<UsersEntity[]> {
    try {
      const users: UsersEntity[] = await this.userRepository.find({
        relations: ['boards'],
      });
      if (users.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No hay Registros',
        });
      }
      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUserById(id: string): Promise<UsersEntity> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.boards', 'boards')
        .where({ id })
        .getOne();
      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró el registro.',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UsersEntity> {
    try {
      const { boardsIds, ...updateDataWithoutBoardsIds } = createUserDto;
      const user = await this.userRepository.save(updateDataWithoutBoardsIds);

      if (boardsIds && boardsIds.length > 0) {
        await this.addBoardsToUser(user.id, boardsIds);
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const { boardsIds, ...updateDataWithoutBoardsIds } = updateUserDto;

      const user: UpdateResult = await this.userRepository.update(
        id,
        updateDataWithoutBoardsIds,
      );

      if (boardsIds && boardsIds.length > 0) {
        this.addBoardsToUser(id, boardsIds);
      }

      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se se pudo actualizar',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);
      if (user.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se se pudo eliminar',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async addBoardsToUser(id: string, boardIds: string[]): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['boards'],
      });

      // Filtra los tableros duplicados antes de agregarlos
      const uniqueBoardIds = boardIds.filter(
        (id) => !user.boards.some((board) => board.id === id),
      );

      if (uniqueBoardIds.length > 0) {
        const boardsToAdd =
          await this.boardRepository.findByIds(uniqueBoardIds);
        user.boards.push(...boardsToAdd);

        await this.userRepository.save(user);
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async removeBoardsFromUser(
    id: string,
    boardIds: string[],
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['boards'],
      });

      user.boards = user.boards.filter((board) => !boardIds.includes(board.id));

      await this.userRepository.save(user);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
