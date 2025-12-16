import { api } from './http';
import type { User } from '../types/models';

// Fetch all users
export function fetchUsers() {
  return api<User[]>('/users');
}
