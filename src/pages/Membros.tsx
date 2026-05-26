import { useState } from 'react'
import {
  Row, Col, Card, Avatar, Tag, Button, Modal, Form, Input, Select, theme,
  Typography, Empty, Space, Tooltip,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, MailOutlined, PhoneOutlined,
  DeleteOutlined, FilterOutlined,
} from '@ant-design/icons'
import { useMembros } from '../store/useMembros'
import { useTimes } from '../store/useTimes'
import type { Membro } from '../lib/types'

const { Text, Title } = Typography

const statusConfig: Record<string, { color: string; label: string }> = {
  ativo: { color: 'success', label: 'Ativo' },
  ausente: { color: 'warning', label: 'Ausente' },
  ferias: { color: 'purple', label: 'Férias' },
}

export default function Membros() {
  const { membros, add, update, remove } = useMembros()
  const { times } = useTimes()
  const { token } = theme.useToken()
  const [search, setSearch] = useState('')
  const [filterTime, setFilterTime] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Membro | null>(null)
  const [form] = Form.useForm()

  const filtered = membros.filter((m) => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase()) || m.cargo.toLowerCase().includes(search.toLowerCase())
    const matchTime = !filterTime || m.timeId === filterTime
    return matchSearch && matchTime
  })

  function openNew() {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ timeId: times[0]?.id, status: 'ativo' })
    setModalOpen(true)
  }

  function openEdit(membro: Membro) {
    setEditing(membro)
    form.setFieldsValue(membro)
    setModalOpen(true)
  }

  function handleSubmit() {
    const values = form.getFieldsValue()
    if (!values.nome || !values.email) return
    if (editing) {
      update(editing.id, values)
    } else {
      add(values)
    }
    setModalOpen(false)
  }

  const avatarColors = [
    'linear-gradient(135deg, #4f46e5, #7c3aed)',
    'linear-gradient(135deg, #ec4899, #be185d)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #06b6d4, #0891b2)',
    'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  ]

  function getAvatarGrad(name: string) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return avatarColors[Math.abs(hash) % avatarColors.length]
  }

  return (
    <div className="space-y-5">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.03em' }}>Membros</Title>
          <Text type="secondary">{membros.length} membro{membros.length !== 1 ? 's' : ''} cadastrado{membros.length !== 1 ? 's' : ''}</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openNew}>
            Novo Membro
          </Button>
        </Col>
      </Row>

      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Buscar membros..."
            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Filtrar por time"
            value={filterTime || undefined}
            onChange={(v) => setFilterTime(v ?? '')}
            allowClear
            prefix={<FilterOutlined />}
            size="large"
            style={{ width: '100%' }}
            options={[
              ...times.map((t) => ({ value: t.id, label: t.nome })),
            ]}
          />
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <Card>
          <Empty description="Nenhum membro encontrado" style={{ padding: '40px 0' }} />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((membro) => {
            const time = times.find((t) => t.id === membro.timeId)
            const st = statusConfig[membro.status]
            return (
              <Col xs={24} sm={12} xl={8} key={membro.id}>
                <Card
                  hoverable
                  className="premium-card"
                  onClick={() => openEdit(membro)}
                  actions={[
                    <Tooltip title="Remover" key="remove">
                      <DeleteOutlined
                        style={{ color: token.colorTextTertiary }}
                        onClick={(e) => { e.stopPropagation(); remove(membro.id) }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        size={52}
                        style={{
                          background: getAvatarGrad(membro.nome),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 700,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        }}
                      >
                        {membro.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 15 }}>{membro.nome}</Text>
                        <Tag color={st.color}>{st.label}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>{membro.cargo}</Text>
                        {time && (
                          <Tag
                            style={{ marginLeft: 6, borderRadius: 4, fontSize: 11 }}
                            color={time.cor}
                          >
                            {time.nome}
                          </Tag>
                        )}
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <MailOutlined style={{ marginRight: 6 }} />{membro.email}
                          </Text>
                          {membro.telefone && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              <PhoneOutlined style={{ marginRight: 6 }} />{membro.telefone}
                            </Text>
                          )}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      <Modal
        title={editing ? 'Editar Membro' : 'Novo Membro'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Salvar alterações' : 'Adicionar membro'}
        cancelText="Cancelar"
        width={520}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          initialValues={{ status: 'ativo' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Obrigatório' }]}>
                <Input placeholder="Nome completo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email inválido' }]}>
                <Input placeholder="email@exemplo.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cargo" label="Cargo">
                <Input placeholder="Ex: Desenvolvedor" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="telefone" label="Telefone">
                <Input placeholder="(11) 99999-9999" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="timeId" label="Time">
                <Select
                  options={times.map((t) => ({ value: t.id, label: t.nome }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select
                  options={[
                    { value: 'ativo', label: 'Ativo' },
                    { value: 'ausente', label: 'Ausente' },
                    { value: 'ferias', label: 'Férias' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
