import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

// Enum to define different types of tasks
// This helps in categorizing tasks and associating them with specific handlers
// Can be extended with more task types as needed
export enum TaskType {
  PROCUREMENT = 'PROCUREMENT',
  DEVELOPMENT = 'DEVELOPMENT',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column()
  status: number;

  @Column({ default: false })
  isClosed: boolean;

  // Custom data associated with the task, stored as JSON for handling diverse data structures
  @Column({ type: 'jsonb', nullable: true })
  customData: any;

  @ManyToOne(() => User)
  assignedUser: User;
}