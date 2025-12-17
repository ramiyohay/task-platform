import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { APP_TITLE, QUERY_KEYS, UI_TEXT } from "./constants/app";
import type { Task, TaskType } from "./types/models";
import { useUsers } from "./hooks/useUsers";
import { useUserTasks } from "./hooks/useUserTasks";
import { createTask, changeStatus, closeTask } from "./api/tasks";
import { Button } from "./components/Button";
import { TaskSummaryCard } from "./components/TaskSummaryCard";
import { TaskDialog } from "./components/TaskDialog";
import { ServerStatus } from "./components/ServerStatus";

export default function App() {
  const qc = useQueryClient();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { data: tasks = [], isLoading: tasksLoading } =
    useUserTasks(currentUserId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const activeTask: Task | null = useMemo(() => {
    if (activeTaskId === null) return null;

    return tasks.find((t) => t.id === activeTaskId) ?? null;
  }, [activeTaskId, tasks]);

  // Mutations for creating and updating tasks
  const createMut = useMutation({
    mutationFn: ({ type, userId }: { type: TaskType; userId: number }) =>
      createTask(type, userId),
    onSuccess: (created) => {
      if (currentUserId !== null) {
        qc.setQueryData<Task[]>(QUERY_KEYS.userTasks(currentUserId), (prev) => [
          created,
          ...(prev ?? []),
        ]);
      }

      setMode("edit");
      setActiveTaskId(created.id);
    },
  });

  // Mutation for changing task status (save, forward, back)
  const statusMut = useMutation({
    mutationFn: ({
      taskId,
      status,
      data,
      nextUserId,
    }: {
      taskId: number;
      status: number;
      data: Record<string, any>;
      nextUserId: number;
    }) => changeStatus(taskId, status, data, nextUserId),
    onSuccess: (updated) => {
      if (currentUserId !== null) {
        qc.setQueryData<Task[]>(QUERY_KEYS.userTasks(currentUserId), (prev) => {
          const list = prev ?? [];
          const without = list.filter((t) => t.id !== updated.id);

          return [updated, ...without];
        });
      }

      setActiveTaskId(updated.id);
    },
  });

  // Mutation for closing a task
  const closeMut = useMutation({
    mutationFn: (taskId: number) => closeTask(taskId),
    onSuccess: (updated) => {
      if (currentUserId !== null) {
        qc.setQueryData<Task[]>(QUERY_KEYS.userTasks(currentUserId), (prev) => {
          const list = prev ?? [];
          const without = list.filter((t) => t.id !== updated.id);

          return [updated, ...without];
        });
      }

      setActiveTaskId(updated.id);
    },
  });

  const busy =
    usersLoading ||
    tasksLoading ||
    createMut.isPending ||
    statusMut.isPending ||
    closeMut.isPending;

  function openCreate() {
    setMode("create");
    setActiveTaskId(null);
    setDialogOpen(true);
  }

  function openEdit(taskId: number) {
    setMode("edit");
    setActiveTaskId(taskId);
    setDialogOpen(true);
  }

  return (
    <div className="container">
      <ServerStatus />
      <div className="header">
        <div className="title">{APP_TITLE}</div>
        <div className="toolbar">
          <label className="field" style={{ minWidth: 240 }}>
            <span className="label">{UI_TEXT.selectUser}</span>

            <select
              className="select"
              value={currentUserId ?? ""}
              onChange={(e) => setCurrentUserId(Number(e.target.value) || null)}
              disabled={usersLoading}
            >
              <option value="" disabled>
                Select…
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>

          <Button
            onClick={openCreate}
            disabled={currentUserId === null || usersLoading}
          >
            {UI_TEXT.createTask}
          </Button>

          
        </div>
      </div>

      {currentUserId === null ? (
        <div className="muted">Select a user</div>
      ) : tasksLoading ? (
        <div className="muted">Loading tasks…</div>
      ) : (
        <div className="list">
          {tasks.map((t) => (
            <TaskSummaryCard
              key={t.id}
              task={t}
              onOpen={() => openEdit(t.id)}
            />
          ))}
          {tasks.length === 0 ? <div className="muted">No tasks</div> : null}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        mode={{ kind: mode }}
        task={mode === "edit" ? activeTask : null}
        users={users}
        busy={busy}
        onClose={() => setDialogOpen(false)}
        onCreate={async (type, userId) => {
          const created = await createMut.mutateAsync({ type, userId });
          return created;
        }}
        onSave={async (taskId, data, nextUserId) => {
          const t = tasks.find((x) => x.id === taskId);

          if (!t) throw new Error("Task missing");
          // save without moving = PATCH same status
          // mutateAsync runs mutationFn with given args
          return await statusMut.mutateAsync({
            taskId,
            status: t.status,
            data,
            nextUserId,
          });
        }}
        onForward={async (taskId, data, nextUserId) => {
          const t = tasks.find((x) => x.id === taskId);

          if (!t) throw new Error("Task missing");

          return await statusMut.mutateAsync({
            taskId,
            status: t.status + 1,
            data,
            nextUserId,
          });
        }}
        onBack={async (taskId, data, nextUserId) => {
          const t = tasks.find((x) => x.id === taskId);

          if (!t) throw new Error("Task missing");

          return await statusMut.mutateAsync({
            taskId,
            status: t.status - 1,
            data,
            nextUserId,
          });
        }}
        onCloseTask={async (taskId) => {
          return await closeMut.mutateAsync(taskId);
        }}
      />
    </div>
  );
}
