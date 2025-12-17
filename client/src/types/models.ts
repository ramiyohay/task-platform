// New type definition can be added here
export enum TaskType {
  PROCUREMENT = 'PROCUREMENT',
  DEVELOPMENT = 'DEVELOPMENT',
}

export type User = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  type: TaskType;
  status: number;
  isClosed: boolean;
  customData: Record<string, any> | null;
  assignedUser: User;
};
