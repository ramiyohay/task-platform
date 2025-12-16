import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Task } from '../tasks/task.entity';

// Controller to manage user-related endpoints
@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // Endpoint to retrieve all users
  @Get()
  getUsers() {
    return this.userRepo.find();
  }

  // Endpoint to retrieve tasks assigned to a specific user
@Get(':id/tasks')
getUserTasks(@Param('id') id: string) {
  return this.taskRepo
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.assignedUser', 'user')
    .where('user.id = :id', { id: Number(id) })
    .orderBy('task.id', 'DESC')
    .getMany();
}

}