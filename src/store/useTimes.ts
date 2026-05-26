import { create } from 'zustand'
import type { Time } from '../lib/types'
import { generateId } from '../lib/utils'

interface TimeState {
  times: Time[]
  add: (time: Omit<Time, 'id' | 'createdAt'>) => void
  update: (id: string, data: Partial<Time>) => void
  remove: (id: string) => void
}

const INITIAL: Time[] = [
  { id: '1', nome: 'Frontend', descricao: 'Time de desenvolvimento frontend', cor: '#6366f1', createdAt: new Date().toISOString() },
  { id: '2', nome: 'Backend', descricao: 'Time de desenvolvimento backend', cor: '#f59e0b', createdAt: new Date().toISOString() },
  { id: '3', nome: 'Design', descricao: 'Time de design e UX', cor: '#ec4899', createdAt: new Date().toISOString() },
]

export const useTimes = create<TimeState>((set) => ({
  times: JSON.parse(localStorage.getItem('times') ?? JSON.stringify(INITIAL)),
  add: (time) =>
    set((state) => {
      const novo: Time = { ...time, id: generateId(), createdAt: new Date().toISOString() }
      const next = [...state.times, novo]
      localStorage.setItem('times', JSON.stringify(next))
      return { times: next }
    }),
  update: (id, data) =>
    set((state) => {
      const next = state.times.map((t) => (t.id === id ? { ...t, ...data } : t))
      localStorage.setItem('times', JSON.stringify(next))
      return { times: next }
    }),
  remove: (id) =>
    set((state) => {
      const next = state.times.filter((t) => t.id !== id)
      localStorage.setItem('times', JSON.stringify(next))
      return { times: next }
    }),
}))
