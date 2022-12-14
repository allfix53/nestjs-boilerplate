import {
  Body,
  Post,
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');

  constructor(private taskService: TasksService) {}

  @Get('/')
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    // customer decorator @GetUser to get user from auth header
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retrieving all the tasks. `);
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    // customer decorator @GetUser to get user from auth header
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} get task by id ${id} all the tasks. `,
    );
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    // customer decorator @GetUser to get user from auth header
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }
}
