import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from '../entities/board.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { ListEntity } from 'src/lists/entities/list.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /*
   *    Method to get all boards.
   */
  public async findBoards(): Promise<BoardEntity[]> {
    try {
      const boards: BoardEntity[] = await this.boardRepository.find({
        relations: ['users', 'lists'],
      });
      this.validateBoardRecords(boards);
      return boards;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *     Method to get a board.
   */
  public async findBoardById(id: string): Promise<BoardEntity> {
    try {
      const board: BoardEntity = await this.boardRepository
        .createQueryBuilder('boards')
        .leftJoinAndSelect('boards.lists', 'lists')
        .leftJoinAndSelect('boards.users', 'users')
        .where({ id })
        .getOne();
      this.validateBoardFound(board);
      return board;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to register a new board.
   */
  public async createBoard(
    createUserDto: CreateBoardDto,
  ): Promise<BoardEntity> {
    try {
      const { listsIds, usersIds, ...dataCreateBoardDto } = createUserDto;
      await this.validateUsersExists(usersIds);
      const board = await this.boardRepository.save(dataCreateBoardDto);
      if (listsIds && listsIds.length > 0) {
        await this.setLists(board.id, listsIds);
      }
      if (usersIds && usersIds.length > 0) {
        await this.setUsers(board.id, usersIds);
      }
      this.validateBoardFound(board);
      return board;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to update a record.
   */
  public async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const { listsIds, usersIds, ...dataUpdateBoardDto } = updateBoardDto;
      const board: UpdateResult = await this.boardRepository.update(
        id,
        dataUpdateBoardDto,
      );
      if (listsIds && listsIds.length > 0) {
        await this.setLists(id, listsIds);
      }
      if (usersIds && usersIds.length > 0) {
        await this.setUsers(id, usersIds);
      }
      this.validateBoardUpdated(board);
      return board;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to delete the user.
   */
  public async deleteBoard(id: string): Promise<DeleteResult | undefined> {
    try {
      const result: DeleteResult = await this.boardRepository.delete(id);
      this.validateBoardDeleted(result);
      return result;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to establish the user.
   */
  public async setUsers(id: string, usersIds: string[]): Promise<void> {
    try {
      const board = await this.boardRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      const usersToAdd = await this.userRepository.findByIds(usersIds);
      board.users = usersToAdd;
      await this.boardRepository.save(board);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to establish the boards.
   */
  public async setLists(id: string, listsIds: string[]): Promise<void> {
    try {
      const board = await this.boardRepository.findOne({
        where: { id },
        relations: ['lists'],
      });
      const listsToAdd = await this.listRepository.findByIds(listsIds);
      board.lists = listsToAdd;
      await this.boardRepository.save(board);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async validateUsersExists(usersIds: string[]): Promise<void> {
    const users = await this.userRepository.findByIds(usersIds);
    if (users.length === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: `Users with ID ${usersIds} not found.`,
      });
    }
  }

  private validateBoardRecords(boards: BoardEntity[]): void {
    if (boards.length === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'There are no records...',
      });
    }
  }

  private validateBoardFound(board: BoardEntity): void {
    if (!board) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Record not found.',
      });
    }
  }

  private validateBoardUpdated(board: UpdateResult): void {
    if (board.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not update',
      });
    }
  }

  private validateBoardDeleted(board: DeleteResult): void {
    if (board.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not delete',
      });
    }
  }
}
