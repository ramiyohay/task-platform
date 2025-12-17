import { Controller, Post, Patch, Param, Body } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TaskType } from "./task.entity";

// Controller to manage task-related endpoints
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Create a new task
  @Post()
  create(@Body() body: { type: TaskType; userId: number }) {
    return this.tasksService.create(body.type, body.userId);
  }

  // Change the status of a task
  @Patch(":id/status")
  changeStatus(
    @Param("id") id: string,
    @Body() body: { status: number; data: any; nextUserId: number }
  ) {
    return this.tasksService.changeStatus(
      Number(id),
      body.status,
      body.data,
      body.nextUserId
    );
  }

  // Close a task
  @Post(":id/close")
  close(@Param("id") id: string) {
    return this.tasksService.close(Number(id));
  }
}
