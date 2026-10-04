export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  created_at: string
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
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

export async function fetchTodos(): Promise<Todo[]> {
  const data = await req<{ todos: Todo[] }>('/api/todos')
  return data.todos
}

export async function createTodo(title: string, description: string): Promise<Todo> {
  const data = await req<{ todo: Todo }>('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  })
  return data.todo
}

export async function toggleTodo(todo: Todo): Promise<Todo> {
  const data = await req<{ todo: Todo }>(`/api/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed })
  })
  return data.todo
}

export async function deleteTodo(id: number): Promise<void> {
  await req(`/api/todos/${id}`, { method: 'DELETE' })
}
