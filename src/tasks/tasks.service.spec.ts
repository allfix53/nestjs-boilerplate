import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'alfi',
  id: 'dummy',
  password: 'password',
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('Calls TasksRepository.getTasks and return the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('somevalue');
      const result = await tasksRepository.getTasks(null, mockUser);
      expect(result).toEqual('somevalue');
    });
  });

  describe('getTaskById', () => {
    it('Calls TaskRepository.findOne and return the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'description',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      // set jest.fn() to set return expected value
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('Calls TaskRepository.findOne and handle the error', async () => {
      // set jest.fn() to set return expected value
      tasksRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
