import { vi } from 'vitest'

// Tests never talk to a real Redis: every file gets the in-memory implementation.
vi.mock('@vercel/kv', async () => {
  const { memoryKv } = await import('./__tests__/helpers/memory-kv')
  return { createClient: () => memoryKv, kv: memoryKv }
})
