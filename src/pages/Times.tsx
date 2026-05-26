import { useState } from 'react'
import {
  Row, Col, Card, Button, Modal, Form, Input, Select, theme,
  Typography, Avatar, Tooltip,
} from 'antd'
import { PlusOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons'
import { useTimes } from '../store/useTimes'
import { useMembros } from '../store/useMembros'
import type { Time } from '../lib/types'

const { Text, Title } = Typography

const colorOptions = ['#4f46e5', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#84cc16']

export default function Times() {
  const { times, add, update, remove } = useTimes()
  const { membros } = useMembros()
  const { token } = theme.useToken()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Time | null>(null)
  const [form] = Form.useForm()

  function openNew() {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ cor: colorOptions[Math.floor(Math.random() * colorOptions.length)] })
    setModalOpen(true)
  }

  function openEdit(time: Time) {
    setEditing(time)
    form.setFieldsValue(time)
    setModalOpen(true)
  }

  function handleSubmit() {
    const values = form.getFieldsValue()
    if (!values.nome) return
    if (editing) {
      update(editing.id, values)
    } else {
      add(values)
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.03em' }}>Times</Title>
          <Text type="secondary">{times.length} time{times.length > 1 ? 's' : ''} cadastrado{times.length > 1 ? 's' : ''}</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openNew}>
            Novo Time
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {times.map((time) => {
          const membrosDoTime = membros.filter((m) => m.timeId === time.id)
          return (
            <Col xs={24} sm={12} xl={8} key={time.id}>
              <Card
                hoverable
                className="premium-card"
                onClick={() => openEdit(time)}
                actions={[
                  <Tooltip title="Remover" key="remove">
                    <DeleteOutlined
                      style={{ color: token.colorTextTertiary }}
                      onClick={(e) => { e.stopPropagation(); remove(time.id) }}
                    />
                  </Tooltip>,
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: 10,
                      background: time.cor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 700, color: '#fff',
                      boxShadow: `${time.cor}33 0 8px 24px`,
                    }}
                  >
                    {time.nome[0]}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 15, display: 'block' }}>{time.nome}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      {membrosDoTime.length} membro{membrosDoTime.length !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </div>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12, lineHeight: 1.5 }}>
                  {time.descricao || 'Sem descrição'}
                </Text>
                {membrosDoTime.length > 0 && (
                  <Avatar.Group max={{ count: 5 }}>
                    {membrosDoTime.map((m) => (
                      <Tooltip title={m.nome} key={m.id}>
                        <Avatar style={{ background: '#4f46e5', verticalAlign: 'middle' }}>
                          {m.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                )}
              </Card>
            </Col>
          )
        })}
      </Row>

      <Modal
        title={editing ? 'Editar Time' : 'Novo Time'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Salvar alterações' : 'Criar time'}
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item name="nome" label="Nome do Time" rules={[{ required: true, message: 'Obrigatório' }]}>
            <Input placeholder="Ex: Frontend" />
          </Form.Item>
          <Form.Item name="descricao" label="Descrição">
            <Input.TextArea rows={3} placeholder="Descrição do time" />
          </Form.Item>
          <Form.Item name="cor" label="Cor">
            <Select>
              {colorOptions.map((c) => (
                <Select.Option key={c} value={c}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: c }} />
                    {c}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
