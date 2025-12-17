import { API_BASE_URL } from '../constants/app';

export async function checkServer() {
  const res = await fetch(`${API_BASE_URL}/health`);

  if (!res.ok) throw new Error('Server unreachable');

  return true;
}
