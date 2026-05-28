import { useState, useCallback, useMemo } from 'react'
import {
  Row, Col, Card, Tag, Button, Modal, Form, Input, Select, Avatar, theme,
  Typography, Tooltip,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, UserOutlined, CalendarOutlined,
} from '@ant-design/icons'
import {
  DndContext, DragOverlay, useSensor, useSensors, useDroppable,
  PointerSensor, closestCorners,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTarefas } from '../store/useTarefas'
import { useMembros } from '../store/useMembros'
import { useTimes } from '../store/useTimes'
import type { Tarefa } from '../lib/types'

const { Text, Title } = Typography

const columns = [
  { id: 'todo' as const, title: 'A Fazer', subtitle: 'Pendentes', color: '#9ca3af' },
  { id: 'doing' as const, title: 'Fazendo', subtitle: 'Em desenvolvimento', color: '#4f46e5' },
  { id: 'done' as const, title: 'Concluído', subtitle: 'Finalizado', color: '#10b981' },
]

const priorityConfig: Record<string, { color: string; label: string }> = {
  baixa: { color: 'blue', label: 'Baixa' },
  media: { color: 'gold', label: 'Média' },
  alta: { color: 'orange', label: 'Alta' },
  urgente: { color: 'red', label: 'Urgente' },
}

function DraggableTaskCard({
  tarefa,
  onClick,
  onRemove,
  responsavelName,
  prioridade,
  prazo,
  token,
}: {
  tarefa: Tarefa
  onClick: () => void
  onRemove: (e: React.MouseEvent) => void
  responsavelName?: string
  prioridade: { color: string; label: string }
  prazo?: string
  token: ReturnType<typeof theme.useToken>['token']
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tarefa.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        className="premium-card"
        hoverable
        onClick={onClick}
        style={{
          border: isDragging ? '2px solid #4f46e5' : undefined,
          boxShadow: isDragging ? '0 4px 16px rgba(79,70,229,0.2)' : undefined,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text strong style={{ fontSize: 13, flex: 1 }}>{tarefa.titulo}</Text>
          <Tag color={prioridade.color} style={{ borderRadius: 4, fontSize: 10, lineHeight: '18px', marginLeft: 8 }}>
            {prioridade.label}
          </Tag>
        </div>
        {tarefa.descricao && (
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8, lineHeight: 1.4 }}>
            {tarefa.descricao.length > 60 ? tarefa.descricao.slice(0, 60) + '...' : tarefa.descricao}
          </Text>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: `1px solid ${token.colorBorderSecondary}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {responsavelName ? (
              <Avatar size={22} style={{ background: '#4f46e5', fontSize: 10 }}>
                {responsavelName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Avatar>
            ) : <UserOutlined style={{ color: token.colorTextTertiary }} />}
            {prazo && (
              <Text type="secondary" style={{ fontSize: 10 }}>
                <CalendarOutlined style={{ marginRight: 2 }} />
                {new Date(prazo).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </div>
          <Tooltip title="Remover">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => { e.stopPropagation(); onRemove(e) }}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        </div>
      </Card>
    </div>
  )
}

function SortableColumn({
  col,
  tasks,
  membros,
  token,
  openEdit,
  remove,
  isOver,
}: {
  col: typeof columns[number]
  tasks: Tarefa[]
  membros: { id: string; nome: string }[]
  token: ReturnType<typeof theme.useToken>['token']
  openEdit: (t: Tarefa) => void
  remove: (id: string) => void
  isOver: boolean
}) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks])
  const { setNodeRef } = useDroppable({ id: col.id })

  return (
    <Col xs={24} md={8} key={col.id}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
          <Text strong style={{ fontSize: 14 }}>{col.title}</Text>
          <Tag style={{ marginLeft: 'auto', borderRadius: 6, fontSize: 11 }}>{tasks.length}</Tag>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>{col.subtitle}</Text>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          style={{
            display: 'flex', flexDirection: 'column', gap: 10, minHeight: 120,
            padding: 8, borderRadius: 12,
            background: isOver ? `${col.color}0D` : 'transparent',
            border: isOver ? `2px dashed ${col.color}40` : '2px dashed transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {tasks.map((tarefa) => {
            const membro = membros.find((m) => m.id === tarefa.responsavelId)
            const prio = priorityConfig[tarefa.prioridade]
            return (
              <DraggableTaskCard
                key={tarefa.id}
                tarefa={tarefa}
                onClick={() => openEdit(tarefa)}
                onRemove={(e) => { e.stopPropagation(); remove(tarefa.id) }}
                responsavelName={membro?.nome}
                prioridade={prio}
                prazo={tarefa.prazo}
                token={token}
              />
            )
          })}
          {tasks.length === 0 && (
            <div
              style={{
                textAlign: 'center', padding: '24px 0',
                border: `2px dashed ${token.colorBorderSecondary}`,
                borderRadius: 12, flex: 1,
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>Nenhuma tarefa</Text>
            </div>
          )}
        </div>
      </SortableContext>
    </Col>
  )
}

export default function Tarefas() {
  const { tarefas, add, update, remove, move } = useTarefas()
  const { membros } = useMembros()
  const { times } = useTimes()
  const { token } = theme.useToken()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Tarefa | null>(null)
  const [form] = Form.useForm()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumnId, setOverColumnId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const filtered = useMemo(() =>
    tarefas.filter((t) =>
      t.titulo.toLowerCase().includes(search.toLowerCase())
    ), [tarefas, search]
  )

  function openNew() {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      status: 'todo', prioridade: 'media',
      responsavelId: membros[0]?.id,
      timeId: times[0]?.id,
    })
    setModalOpen(true)
  }

  function openEdit(tarefa: Tarefa) {
    setEditing(tarefa)
    form.setFieldsValue({ ...tarefa, prazo: tarefa.prazo || undefined })
    setModalOpen(true)
  }

  function handleSubmit() {
    const values = form.getFieldsValue()
    if (!values.titulo) return
    const data = { ...values, prazo: values.prazo || undefined }
    if (editing) {
      update(editing.id, data)
    } else {
      add(data)
    }
    setModalOpen(false)
  }

  const findColumnOfTask = useCallback((taskId: string): string | null => {
    for (const col of columns) {
      if (filtered.some((t) => t.status === col.id && t.id === taskId)) {
        return col.id
      }
    }
    return null
  }, [filtered])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string | undefined
    if (!overId) {
      setOverColumnId(null)
      return
    }
    const colId = columns.find((c) => c.id === overId)?.id ?? findColumnOfTask(overId)
    setOverColumnId(colId ?? null)
  }, [findColumnOfTask])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null)
    setOverColumnId(null)

    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    const targetColumn = columns.find((c) => c.id === overId)?.id ?? findColumnOfTask(overId)
    const sourceColumn = findColumnOfTask(activeTaskId)

    if (!targetColumn || !sourceColumn) return
    if (sourceColumn !== targetColumn) {
      move(activeTaskId, targetColumn as Tarefa['status'])
    }
  }, [findColumnOfTask, move])

  const activeTask = useMemo(() => {
    if (!activeId) return null
    return tarefas.find((t) => t.id === activeId) ?? null
  }, [activeId, tarefas])

  return (
    <div className="space-y-5">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.03em' }}>Tarefas</Title>
          <Text type="secondary">{tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''} no total</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openNew}>
            Nova Tarefa
          </Button>
        </Col>
      </Row>

      <Col xs={24} sm={12} md={8}>
        <Input
          placeholder="Buscar tarefas..."
          prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="large"
        />
      </Col>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Row gutter={[16, 16]}>
          {columns.map((col) => {
            const tasks = filtered.filter((t) => t.status === col.id)
            return (
              <SortableColumn
                key={col.id}
                col={col}
                tasks={tasks}
                membros={membros}
                token={token}
                openEdit={openEdit}
                remove={remove}
                isOver={overColumnId === col.id}
              />
            )
          })}
        </Row>

        <DragOverlay>
          {activeTask ? (
            <div style={{ transform: 'rotate(3deg)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', borderRadius: 10, pointerEvents: 'none' }}>
              <Card size="small" className="premium-card" style={{ width: 280, border: '2px solid #4f46e5' }}>
                <Text strong style={{ fontSize: 13 }}>{activeTask.titulo}</Text>
                {activeTask.descricao && (
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                    {activeTask.descricao.length > 60 ? activeTask.descricao.slice(0, 60) + '...' : activeTask.descricao}
                  </Text>
                )}
              </Card>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        title={editing ? 'Editar Tarefa' : 'Nova Tarefa'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Salvar alterações' : 'Criar tarefa'}
        cancelText="Cancelar"
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item name="titulo" label="Título" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="Título da tarefa" />
          </Form.Item>
          <Form.Item name="descricao" label="Descrição">
            <Input.TextArea rows={3} placeholder="Descrição detalhada" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="responsavelId" label="Responsável">
                <Select
                  options={membros.map((m) => ({ value: m.id, label: m.nome }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="timeId" label="Time">
                <Select
                  options={times.map((t) => ({ value: t.id, label: t.nome }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="prioridade" label="Prioridade">
                <Select
                  options={[
                    { value: 'baixa', label: 'Baixa' },
                    { value: 'media', label: 'Média' },
                    { value: 'alta', label: 'Alta' },
                    { value: 'urgente', label: 'Urgente' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="prazo" label="Prazo">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { value: 'todo', label: 'A Fazer' },
                { value: 'doing', label: 'Fazendo' },
                { value: 'done', label: 'Concluído' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
