import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { SeedService } from './database/seed.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [ // Configure TypeORM with PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tasks',
      entities: [Task, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    TasksModule,
    UsersModule,
  ],
  providers: [SeedService],
  controllers: [HealthController],
})

export class AppModule {}