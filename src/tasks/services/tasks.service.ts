import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { ListEntity } from 'src/lists/entities/list.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async findTasks(): Promise<TaskEntity[]> {
    try {
      const key = 'task-find-all';
      const tasksCached = await this.cacheManager.get<TaskEntity[]>(key);
      if (tasksCached) return tasksCached;
      const tasks: TaskEntity[] = await this.taskRepository.find({
        relations: ['list'],
      });
      this.validateTaskRecords(tasks);
      this.cacheManager.set(key, tasks, 1000 * 10);
      return tasks;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findTaskById(id: string): Promise<TaskEntity> {
    try {
      const key = `task-find-${id}`;
      const taskCached = await this.cacheManager.get<TaskEntity>(key);
      if (taskCached) return taskCached;
      const task = await this.taskRepository
        .createQueryBuilder('tasks')
        .leftJoinAndSelect('tasks.list', 'list')
        .where({ id })
        .getOne();
      this.validateTaskFound(task);
      this.cacheManager.set(key, task, 1000 * 10);
      return task;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      const { listId, ...dataCreateTaskDto } = createTaskDto;
      await this.validateListExists(listId);
      const task = await this.taskRepository.save(dataCreateTaskDto);
      if (listId && listId.length > 0) await this.setList(task.id, listId);
      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateResult | undefined> {
    try {
      const { listId, ...dataUpdateTaskDto } = updateTaskDto;
      if (listId && listId.length > 0) await this.setList(id, listId);
      const task: UpdateResult = await this.taskRepository.update(
        id,
        dataUpdateTaskDto,
      );

      this.validateTaskUpdated(task);
      return task;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteTask(id: string): Promise<DeleteResult | undefined> {
    try {
      const task: DeleteResult = await this.taskRepository.delete(id);
      this.validateTaskDeleted(task);
      return task;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async setList(id: string, listId: string): Promise<void> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['list'],
      });
      const list = await this.listRepository.findOne({
        where: { id: listId },
      });
      task.list = list;
      await this.taskRepository.save(task);
    } catch (error) {}
  }

  public async validateListExists(listId: string): Promise<void> {
    const list = await this.listRepository.findOne({
      where: { id: listId },
    });

    if (!list) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: `List with ID ${listId} not found.`,
      });
    }
  }

  private validateTaskRecords(tasks: TaskEntity[]): void {
    if (tasks.length === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'There are no records...',
      });
    }
  }

  private validateTaskFound(task: TaskEntity): void {
    if (!task) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Record not found.',
      });
    }
  }

  private validateTaskUpdated(task: UpdateResult): void {
    if (task.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not update',
      });
    }
  }

  private validateTaskDeleted(task: DeleteResult): void {
    if (task.affected === 0) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Could not delete',
      });
    }
  }
}
