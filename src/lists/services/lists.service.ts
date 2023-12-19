import { Inject, Injectable } from '@nestjs/common';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListEntity } from '../entities/list.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { TaskEntity } from 'src/tasks/entities/task.entity';
import { BoardEntity } from 'src/boards/entities/board.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /*
   *    Method to get all lists.
   */
  public async findLists(): Promise<ListEntity[]> {
    try {
      const key = 'lists-find-all';
      const listsCached = await this.cacheManager.get<ListEntity[]>(key);
      if (listsCached) return listsCached;
      const lists: ListEntity[] = await this.listRepository.find({
        relations: ['tasks', 'board'],
      });
      this.validateListRecords(lists);
      this.cacheManager.set(key, lists, 1000 * 10);
      return lists;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *     Method to get a list.
   */
  public async findListById(id: string): Promise<ListEntity> {
    try {
      const key = `list-find-${id}`;
      const listCached = await this.cacheManager.get<ListEntity>(key);
      if (listCached) return listCached;
      const list = await this.listRepository
        .createQueryBuilder('lists')
        .leftJoinAndSelect('lists.tasks', 'tasks')
        .leftJoinAndSelect('lists.board', 'board')
        .where({ id })
        .getOne();
      this.validateListFound(list);
      this.cacheManager.set(key, list, 1000 * 10);
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to register a new list.
   */
  public async createList(createListDto: CreateListDto): Promise<ListEntity> {
    try {
      const { tasksIds, boardId, ...dataCreateListDto } = createListDto;
      await this.validateBoardExists(boardId);
      const list = await this.listRepository.save(dataCreateListDto);
      if (tasksIds && tasksIds.length > 0)
        await this.setTasks(list.id, tasksIds);
      if (boardId && boardId.length > 0) await this.setBoard(list.id, boardId);
      this.validateListFound(list);
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to update a record.
   */
  public async updateList(
    id: string,
    updateListDto: UpdateListDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const { tasksIds, boardId, ...dataUpdateListDto } = updateListDto;
      const list: UpdateResult = await this.listRepository.update(
        id,
        dataUpdateListDto,
      );
      if (tasksIds && tasksIds.length > 0) await this.setTasks(id, tasksIds);
      if (boardId && boardId.length > 0) await this.setBoard(id, boardId);
      this.validateListUpdated(list);
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to delete the list.
   */
  public async deleteList(id: string): Promise<DeleteResult | undefined> {
    try {
      const list: DeleteResult = await this.listRepository.delete(id);
      this.validateListDeleted(list);
      return list;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to establish the tasks.
   */
  public async setTasks(id: string, taskIds: string[]): Promise<void> {
    try {
      const list = await this.listRepository.findOne({
        where: { id },
        relations: ['tasks'],
      });
      const tasksToAdd = await this.taskRepository.findByIds(taskIds);
      list.tasks = tasksToAdd;
      await this.listRepository.save(list);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*
   *    Method to establish the user.
   */
  public async setBoard(id: string, boardId: string): Promise<void> {
    try {
      const list = await this.listRepository.findOne({
        where: { id },
        relations: ['board'],
      });
      const boardToAdd = await this.boardRepository.findOne({
        where: { id: boardId },
      });
      list.board = boardToAdd;
      await this.listRepository.save(list);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async validateBoardExists(boardId: string): Promise<void> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: `Board with ID ${boardId} not found.`,
      });
    }
  }

  private validateListRecords(lists: ListEntity[]): void {
    if (lists.length === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'There are no records...',
      });
    }
  }

  private validateListFound(list: ListEntity): void {
    if (!list) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Record not found.',
      });
    }
  }

  private validateListUpdated(list: UpdateResult): void {
    if (list.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not update',
      });
    }
  }

  private validateListDeleted(list: DeleteResult): void {
    if (list.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not delete',
      });
    }
  }
}
