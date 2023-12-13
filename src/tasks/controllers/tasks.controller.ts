import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('all')
  public async findAllTasks() {
    return this.tasksService.findTasks();
  }

  @Get(':id')
  public async findAllTaskById(@Param('id') id: string) {
    return this.tasksService.findTaskById(id);
  }

  @Post('register')
  public async registerTask(@Body() createUserDto: CreateTaskDto) {
    return await this.tasksService.createTask(createUserDto);
  }

  @Put('edit/:id')
  public async updateTask(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(id, body);
  }

  @Delete('delete/:id')
  public async deleteTask(@Param('id') id: string) {
    return await this.tasksService.deleteTask(id);
  }
}
