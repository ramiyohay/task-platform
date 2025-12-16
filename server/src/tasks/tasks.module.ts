import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { TaskEngineService } from './task-engine.service';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskTypeRegistry } from './task-types/task-type.registry';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  providers: [TaskEngineService, TaskTypeRegistry, TasksService],
  controllers: [TasksController],
})
export class TasksModule {}