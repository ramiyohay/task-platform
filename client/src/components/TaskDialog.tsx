import { useEffect, useMemo, useState } from "react";
import type { Task, TaskType, User } from "../types/models";
import { UI_TEXT } from "../constants/app";
import {
  getFinalStatus,
  getRequiredFields,
  getStatusLabel,
} from "../constants/taskDefinitions";
import { Button } from "./Button";
import { Modal } from "./Modal";

type Mode = { kind: "create" } | { kind: "edit" };

export function TaskDialog({
  open,
  mode,
  task,
  users,
  busy,
  onClose,
  onCreate,
  onSave,
  onForward,
  onBack,
  onCloseTask,
}: {
  open: boolean;
  mode: Mode;
  task: Task | null;
  users: User[];
  busy: boolean;
  onClose: () => void;
  onCreate: (type: TaskType, userId: number) => Promise<Task>;
  onSave: (
    taskId: number,
    data: Record<string, any>,
    nextUserId: number
  ) => Promise<Task>;
  onForward: (
    taskId: number,
    data: Record<string, any>,
    nextUserId: number
  ) => Promise<Task>;
  onBack: (
    taskId: number,
    data: Record<string, any>,
    nextUserId: number
  ) => Promise<Task>;
  onCloseTask: (taskId: number) => Promise<Task>;
}) {
  const isCreate = mode.kind === "create";
  const isClosed = task?.isClosed ?? false;
  const [createType, setCreateType] = useState<TaskType>(
    "PROCUREMENT" as TaskType
  );

  const [createUserId, setCreateUserId] = useState<number | "">("");
  const [data, setData] = useState<Record<string, any>>({});
  const [nextUserId, setNextUserId] = useState<number | "">("");

  // reset/sync when opening
  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      setCreateType("PROCUREMENT" as TaskType);
      setCreateUserId("");
      setData({});
      setNextUserId("");
      return;
    }
    if (task) {
      setData(task.customData ?? {});
      setNextUserId(task.assignedUser?.id ?? users[0]?.id ?? "");
    }
  }, [open, isCreate, task?.id]);

  const finalStatus = useMemo(
    () => (task ? getFinalStatus(task.type) : 1),
    [task?.type]
  );
  const canForward = !!task && task.status < finalStatus;
  const canBack = !!task && task.status > 1;
  const canClose = !!task && task.status === finalStatus && !task.isClosed;
  const fieldsForNext = useMemo(() => {
    if (!task) return [];
    return canForward ? getRequiredFields(task.type, task.status + 1) : [];
  }, [task?.id, task?.status, task?.type, canForward]);

  // silent validation
  const hasNextUser = typeof nextUserId === "number";

  // validate required fields for forwarding to next status
  const forwardValid = useMemo(() => {
    if (!task || !canForward || !hasNextUser) return false;

    for (const f of fieldsForNext) {
      if (f === "priceQuotes") {
        const arr = data?.priceQuotes;
        if (!Array.isArray(arr) || arr.length !== 2) return false;
        if (arr.some((v) => typeof v !== "string" || v.trim() === ""))
          return false;
      } else {
        const v = data?.[f];
        if (typeof v !== "string" || v.trim() === "") return false;
      }
    }

    return true;
  }, [task?.id, canForward, hasNextUser, fieldsForNext, data]);

  const saveValid = useMemo(() => {
    if (!task || !hasNextUser) return false;
    // allow saving at any time; forward/back handle required data
    return true;
  }, [task?.id, hasNextUser]);

  async function submitCreate() {
    if (busy || createUserId === "") return;
    await onCreate(createType, createUserId);
  }

  async function submitSave() {
    if (!task || busy || isClosed || !saveValid) return;
    await onSave(task.id, data, nextUserId as number);
  }

  async function submitForward() {
    if (!task || busy || isClosed || !forwardValid) return;
    await onForward(task.id, data, nextUserId as number);
  }

  async function submitBack() {
    if (!task || busy || isClosed || !canBack || !hasNextUser) return;
    await onBack(task.id, data, nextUserId as number);
  }

  async function submitClose() {
    if (!task || busy || isClosed || !canClose) return;
    await onCloseTask(task.id);
    onClose();
  }

  const title = isCreate
    ? UI_TEXT.createTask
    : `${UI_TEXT.editTask} #${task?.id ?? ""}`;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <div className="footer-row">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {UI_TEXT.cancel}
          </Button>

          {isCreate ? (
            <Button
              onClick={submitCreate}
              disabled={busy || createUserId === ""}
            >
              {UI_TEXT.createTask}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={submitSave}
                disabled={busy || isClosed || !saveValid}
              >
                {UI_TEXT.save}
              </Button>
              <Button
                variant="secondary"
                onClick={submitBack}
                disabled={busy || isClosed || !canBack || !hasNextUser}
              >
                {UI_TEXT.back}
              </Button>
              <Button
                onClick={submitForward}
                disabled={busy || isClosed || !canForward || !forwardValid}
              >
                {UI_TEXT.forward}
              </Button>
              <Button
                variant="danger"
                onClick={submitClose}
                disabled={busy || isClosed || !canClose}
              >
                {UI_TEXT.close}
              </Button>
            </>
          )}
        </div>
      }
    >
      {isCreate ? (
        <div className="grid">
          <label className="field">
            <span className="label">{UI_TEXT.type}</span>
            <select
              className="select"
              value={createType}
              onChange={(e) => setCreateType(e.target.value as TaskType)}
            >
              <option value="PROCUREMENT">PROCUREMENT</option>
              <option value="DEVELOPMENT">DEVELOPMENT</option>
            </select>
          </label>

          <label className="field">
            <span className="label">{UI_TEXT.assignedUser}</span>
            <select
              className="select"
              value={createUserId}
              onChange={(e) => setCreateUserId(Number(e.target.value))}
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
        </div>
      ) : task ? (
        <div className="grid">
          <div className="row">
            <div className="pill">{task.type}</div>
            <div
              className={`pill ${task.isClosed ? "pill-closed" : "pill-open"}`}
            >
              {task.isClosed ? UI_TEXT.closed : UI_TEXT.open}
            </div>
          </div>

          <div className="row">
            <div className="muted">Status</div>
            <div className="strong">
              {getStatusLabel(task.type, task.status)} ({task.status})
            </div>
          </div>

          <label className="field">
            <span className="label">{UI_TEXT.nextUser}</span>
            <select
              className="select"
              value={nextUserId}
              onChange={(e) => setNextUserId(Number(e.target.value))}
              disabled={busy || isClosed || canClose}
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

          {fieldsForNext.length > 0 ? (
            <div className="section">
              {fieldsForNext.map((f) => {
                if (f === "priceQuotes") {
                  const quotes: string[] = Array.isArray(data.priceQuotes)
                    ? data.priceQuotes
                    : ["", ""];

                  return (
                    <div className="section" key="priceQuotes">
                      {[0, 1].map((i) => (
                        <label className="field" key={i}>
                          <span className="label">{`Quote ${i + 1}`}</span>
                          <input
                            className="input"
                            value={quotes[i] ?? ""}
                            onChange={(e) => {
                              const next = [...quotes];
                              next[i] = e.target.value;
                              setData((prev) => ({
                                ...(prev ?? {}),
                                priceQuotes: next,
                              }));
                            }}
                            disabled={busy || isClosed}
                          />
                        </label>
                      ))}
                    </div>
                  );
                }

                // default (string field)
                return (
                  <label className="field" key={f}>
                    <span className="label">{f}</span>
                    <input
                      className="input"
                      value={String(data?.[f] ?? "")}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...(prev ?? {}),
                          [f]: e.target.value,
                        }))
                      }
                      disabled={busy || isClosed}
                    />
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
