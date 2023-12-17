import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { UserEntity } from '../entities/user.entity';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  /*
   *    Method to get all users.
   */
  public async findUsers(): Promise<UserEntity[]> {
    try {
      const users: UserEntity[] = await this.userRepository.find({
        relations: ['boards'],
      });
      this.validateUserRecords(users);
      return users;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *     Method to get a user.
   */
  public async findUserById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.boards', 'boards')
        .where({ id })
        .getOne();
      this.validateUserFound(user);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to register a new user.
   */
  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const { boardsIds, ...dataCreateUserDto } = createUserDto;
      const user = await this.userRepository.save(dataCreateUserDto);
      if (boardsIds && boardsIds.length > 0)
        await this.setBoards(user.id, boardsIds);
      this.validateUserFound(user);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to update a record.
   */
  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const { boardsIds, ...dataUpdateUserDto } = updateUserDto;

      if (boardsIds && boardsIds.length > 0) {
        await this.setBoards(id, boardsIds);
      }
      const user: UpdateResult = await this.userRepository.update(
        id,
        dataUpdateUserDto,
      );
      this.validateUserUpdated(user);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to establish the boards.
   */
  public async setBoards(id: string, boardIds: string[]): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['boards'],
      });
      const boardToAdd = await this.boardRepository.findByIds(boardIds);
      user.boards = boardToAdd;
      await this.userRepository.save(user);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to delete the user.
   */
  public async deleteUser(id: string): Promise<DeleteResult | undefined> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);
      this.validateUserDeleted(user);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method validate user records.
   */
  private validateUserRecords(users: UserEntity[]): void {
    if (users.length === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'There are no records...',
      });
    }
  }

  /*
   *    Method validate user found.
   */
  private validateUserFound(user: UserEntity): void {
    if (!user) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Record not found.',
      });
    }
  }

  /*
   *    Method validate user update.
   */
  private validateUserUpdated(user: UpdateResult): void {
    if (user.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not update',
      });
    }
  }

  /*
   *    Method validate user delete.
   */
  private validateUserDeleted(user: DeleteResult): void {
    if (user.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not delete',
      });
    }
  }
}
