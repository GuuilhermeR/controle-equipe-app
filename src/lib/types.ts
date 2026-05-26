export interface Membro {
  id: string
  nome: string
  email: string
  cargo: string
  avatar?: string
  timeId: string
  status: 'ativo' | 'ausente' | 'ferias'
  telefone?: string
  createdAt: string
}

export interface Time {
  id: string
  nome: string
  descricao: string
  cor: string
  createdAt: string
}

export interface Tarefa {
  id: string
  titulo: string
  descricao: string
  responsavelId: string
  timeId: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'todo' | 'doing' | 'done'
  prazo?: string
  createdAt: string
}

export interface Escala {
  id: string
  membroId: string
  data: string
  turno: 'manha' | 'tarde' | 'noite'
  observacao?: string
}

export type StatusTarefa = Tarefa['status']
export type Prioridade = Tarefa['prioridade']
export type Turno = Escala['turno']
export type StatusMembro = Membro['status']
