export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  created_at: string
}

export interface User {
  id: number
  email: string
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, init)
  } catch {
    throw new Error('Cannot reach server — run `npm run dev` (server :3000 must be up)')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

function jsonInit(body: unknown, method: string): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  }
}

export async function signup(email: string, password: string): Promise<{ token: string; user: User }> {
  return req<{ token: string; user: User }>('/api/auth/signup', jsonInit({ email, password }, 'POST'))
}

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  return req<{ token: string; user: User }>('/api/auth/login', jsonInit({ email, password }, 'POST'))
}

export async function fetchMe(): Promise<User> {
  const data = await req<{ user: User }>('/api/auth/me', { headers: { ...authHeaders() } })
  return data.user
}

export async function fetchTodos(query?: string): Promise<Todo[]> {
  const q = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''
  const data = await req<{ todos: Todo[] }>(`/api/todos${q}`, { headers: { ...authHeaders() } })
  return data.todos
}

export async function createTodo(title: string, description: string): Promise<Todo> {
  const data = await req<{ todo: Todo }>('/api/todos', jsonInit({ title, description }, 'POST'))
  return data.todo
}

export async function toggleTodo(todo: Todo): Promise<Todo> {
  const data = await req<{ todo: Todo }>(
    `/api/todos/${todo.id}`,
    jsonInit({ completed: !todo.completed }, 'PUT')
  )
  return data.todo
}

export async function deleteTodo(id: number): Promise<void> {
  await req(`/api/todos/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
}
