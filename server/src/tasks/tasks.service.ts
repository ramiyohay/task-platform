import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskType } from './task.entity';
import { User } from '../users/user.entity';
import { TaskEngineService } from './task-engine.service';

// Service to manage tasks including creation, status changes, and closure
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly engine: TaskEngineService,
  ) {}

  // Create a new task assigned to a user
  async create(type: TaskType, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    
    if (!user) throw new NotFoundException('User not found');

    const task = this.taskRepo.create({
      type,
      status: 1,
      isClosed: false,
      assignedUser: user,
      customData: {},
    });

    return this.taskRepo.save(task);
  }

  // Change the status of a task with validation
  async changeStatus(taskId: number, status: number, data: any, nextUserId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['assignedUser'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const nextUser = await this.userRepo.findOneBy({ id: nextUserId });
    
    if (!nextUser) throw new NotFoundException('Next user not found');

    this.engine.changeStatus(task, status, data, nextUser);
    return this.taskRepo.save(task);
  }

  // Close a task if it has reached its final status
  async close(taskId: number) {
    const task = await this.taskRepo.findOneBy({ id: taskId });
    
    if (!task) throw new NotFoundException('Task not found');

    this.engine.closeTask(task);
    return this.taskRepo.save(task);
  }
}