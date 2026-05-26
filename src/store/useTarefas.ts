import { create } from 'zustand'
import type { Tarefa } from '../lib/types'
import { generateId } from '../lib/utils'

interface TarefaState {
  tarefas: Tarefa[]
  add: (tarefa: Omit<Tarefa, 'id' | 'createdAt'>) => void
  update: (id: string, data: Partial<Tarefa>) => void
  remove: (id: string) => void
  move: (id: string, status: Tarefa['status']) => void
}

const INITIAL: Tarefa[] = [
  { id: '1', titulo: 'Criar página de login', descricao: 'Implementar tela de autenticação', responsavelId: '2', timeId: '1', prioridade: 'alta', status: 'doing', prazo: '2026-06-01', createdAt: new Date().toISOString() },
  { id: '2', titulo: 'Configurar banco de dados', descricao: 'Setup do PostgreSQL e migrations', responsavelId: '3', timeId: '2', prioridade: 'urgente', status: 'todo', prazo: '2026-05-28', createdAt: new Date().toISOString() },
  { id: '3', titulo: 'Revisar protótipos', descricao: 'Revisão dos wireframes do app', responsavelId: '1', timeId: '1', prioridade: 'media', status: 'done', prazo: '2026-05-25', createdAt: new Date().toISOString() },
  { id: '4', titulo: 'Testar API REST', descricao: 'Testes de integração dos endpoints', responsavelId: '5', timeId: '1', prioridade: 'media', status: 'todo', prazo: '2026-06-05', createdAt: new Date().toISOString() },
  { id: '5', titulo: 'Documentar arquitetura', descricao: 'Criar docs da arquitetura do sistema', responsavelId: '4', timeId: '2', prioridade: 'baixa', status: 'todo', prazo: '2026-06-10', createdAt: new Date().toISOString() },
]

export const useTarefas = create<TarefaState>((set) => ({
  tarefas: JSON.parse(localStorage.getItem('tarefas') ?? JSON.stringify(INITIAL)),
  add: (tarefa) =>
    set((state) => {
      const nova: Tarefa = { ...tarefa, id: generateId(), createdAt: new Date().toISOString() }
      const next = [...state.tarefas, nova]
      localStorage.setItem('tarefas', JSON.stringify(next))
      return { tarefas: next }
    }),
  update: (id, data) =>
    set((state) => {
      const next = state.tarefas.map((t) => (t.id === id ? { ...t, ...data } : t))
      localStorage.setItem('tarefas', JSON.stringify(next))
      return { tarefas: next }
    }),
  remove: (id) =>
    set((state) => {
      const next = state.tarefas.filter((t) => t.id !== id)
      localStorage.setItem('tarefas', JSON.stringify(next))
      return { tarefas: next }
    }),
  move: (id, status) =>
    set((state) => {
      const next = state.tarefas.map((t) => (t.id === id ? { ...t, status } : t))
      localStorage.setItem('tarefas', JSON.stringify(next))
      return { tarefas: next }
    }),
}))
