import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  public async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      return await this.taskRepository.save(createTaskDto);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findTasks(): Promise<TaskEntity[]> {
    try {
      const tasks: TaskEntity[] = await this.taskRepository.find();
      if (tasks.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No hay Registros',
        });
      }
      return tasks;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findTaskById(id: string): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('tasks')
        .where({ id })
        .getOne();
      if (!task) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró el registro.',
        });
      }
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
      const task: UpdateResult = await this.taskRepository.update(
        id,
        updateTaskDto,
      );

      if (task.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se se pudo actualizar',
        });
      }
      return task;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteTask(id: string): Promise<DeleteResult | undefined> {
    try {
      const task: DeleteResult = await this.taskRepository.delete(id);
      if (task.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se se pudo eliminar',
        });
      }
      return task;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
