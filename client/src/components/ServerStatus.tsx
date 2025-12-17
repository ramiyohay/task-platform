import { useServerStatus } from '../hooks/useServerStatus';

export function ServerStatus() {
  const { isLoading, isError } = useServerStatus();

  if (isLoading) {
    return <span className="status status-warn">● Connecting</span>;
  }

  if (isError) {
    return <span className="status status-error">● Server offline</span>;
  }

  return <span className="status status-ok">● Server online</span>;
}
