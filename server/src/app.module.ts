import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
     ConfigModule.forRoot({
      isGlobal: true, // we can access env variables globally
    }),
    TypeOrmModule.forFeature([User]),
    TasksModule,
    UsersModule,
  ],
  providers: [SeedService], // Service to seed the database
  controllers: [HealthController], // Health check controller
})

export class AppModule {}