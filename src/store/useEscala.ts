import { create } from 'zustand'
import type { Escala } from '../lib/types'
import { generateId } from '../lib/utils'

interface EscalaState {
  escalas: Escala[]
  add: (escala: Omit<Escala, 'id'>) => void
  remove: (id: string) => void
  getByMembro: (membroId: string, mes: number, ano: number) => Escala[]
}

export const useEscala = create<EscalaState>((set, get) => ({
  escalas: JSON.parse(localStorage.getItem('escalas') ?? '[]'),
  add: (escala) =>
    set((state) => {
      const nova: Escala = { ...escala, id: generateId() }
      const next = [...state.escalas, nova]
      localStorage.setItem('escalas', JSON.stringify(next))
      return { escalas: next }
    }),
  remove: (id) =>
    set((state) => {
      const next = state.escalas.filter((e) => e.id !== id)
      localStorage.setItem('escalas', JSON.stringify(next))
      return { escalas: next }
    }),
  getByMembro: (membroId, mes, ano) =>
    get().escalas.filter((e) => {
      const date = new Date(e.data)
      return e.membroId === membroId && date.getMonth() === mes && date.getFullYear() === ano
    }),
}))
