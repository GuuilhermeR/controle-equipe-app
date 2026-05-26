import { create } from 'zustand'
import type { Membro } from '../lib/types'
import { generateId } from '../lib/utils'

interface MembroState {
  membros: Membro[]
  add: (membro: Omit<Membro, 'id' | 'createdAt'>) => void
  update: (id: string, data: Partial<Membro>) => void
  remove: (id: string) => void
  getByTime: (timeId: string) => Membro[]
  getById: (id: string) => Membro | undefined
}

const INITIAL: Membro[] = [
  { id: '1', nome: 'Ana Silva', email: 'ana@equipepro.com', cargo: 'Designer', timeId: '1', status: 'ativo', createdAt: new Date().toISOString() },
  { id: '2', nome: 'Carlos Oliveira', email: 'carlos@equipepro.com', cargo: 'Dev Frontend', timeId: '1', status: 'ativo', createdAt: new Date().toISOString() },
  { id: '3', nome: 'Mariana Costa', email: 'mariana@equipepro.com', cargo: 'Dev Backend', timeId: '2', status: 'ativo', createdAt: new Date().toISOString() },
  { id: '4', nome: 'Pedro Santos', email: 'pedro@equipepro.com', cargo: 'PM', timeId: '2', status: 'ferias', createdAt: new Date().toISOString() },
  { id: '5', nome: 'Julia Lima', email: 'julia@equipepro.com', cargo: 'QA', timeId: '1', status: 'ausente', createdAt: new Date().toISOString() },
]

export const useMembros = create<MembroState>((set, get) => ({
  membros: JSON.parse(localStorage.getItem('membros') ?? JSON.stringify(INITIAL)),
  add: (membro) =>
    set((state) => {
      const novo: Membro = { ...membro, id: generateId(), createdAt: new Date().toISOString() }
      const next = [...state.membros, novo]
      localStorage.setItem('membros', JSON.stringify(next))
      return { membros: next }
    }),
  update: (id, data) =>
    set((state) => {
      const next = state.membros.map((m) => (m.id === id ? { ...m, ...data } : m))
      localStorage.setItem('membros', JSON.stringify(next))
      return { membros: next }
    }),
  remove: (id) =>
    set((state) => {
      const next = state.membros.filter((m) => m.id !== id)
      localStorage.setItem('membros', JSON.stringify(next))
      return { membros: next }
    }),
  getByTime: (timeId) => get().membros.filter((m) => m.timeId === timeId),
  getById: (id) => get().membros.find((m) => m.id === id),
}))
