import { useState } from 'react'
import { Card, Button, Modal, Row, Col, Typography, Tag, theme, Tooltip, Space } from 'antd'
import {
  LeftOutlined, RightOutlined, SunOutlined,
  MoonOutlined, CloudOutlined, PlusOutlined,
} from '@ant-design/icons'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEscala } from '../store/useEscala'
import { useMembros } from '../store/useMembros'
import type { Turno } from '../lib/types'

const { Text, Title } = Typography

const turnoConfig: Record<Turno, { icon: typeof SunOutlined; label: string; color: string }> = {
  manha: { icon: SunOutlined, label: 'Manhã', color: '#d97706' },
  tarde: { icon: CloudOutlined, label: 'Tarde', color: '#0284c7' },
  noite: { icon: MoonOutlined, label: 'Noite', color: '#4f46e5' },
}

export default function Escala() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMembro, setSelectedMembro] = useState('')
  const [selectedData, setSelectedData] = useState('')
  const [selectedTurno, setSelectedTurno] = useState<Turno>('manha')
  const { escalas, add, remove } = useEscala()
  const { membros } = useMembros()
  const { token } = theme.useToken()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  function handleDayClick(membroId: string, data: string) {
    const existing = escalas.find((e) => e.membroId === membroId && e.data === data)
    if (existing) {
      remove(existing.id)
    } else {
      setSelectedMembro(membroId)
      setSelectedData(data)
      setSelectedTurno('manha')
      setModalOpen(true)
    }
  }

  function handleAddEscala() {
    add({ membroId: selectedMembro, data: selectedData, turno: selectedTurno })
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.03em' }}>Escala</Title>
          <Text type="secondary">Gestão de turnos da equipe</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<LeftOutlined />} onClick={() => setCurrentDate(subMonths(currentDate, 1))} />
            <Text strong style={{ minWidth: 140, textAlign: 'center', display: 'inline-block' }}>
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </Text>
            <Button icon={<RightOutlined />} onClick={() => setCurrentDate(addMonths(currentDate, 1))} />
            <Button onClick={() => setCurrentDate(new Date())}>Hoje</Button>
          </Space>
        </Col>
      </Row>

      <Card className="premium-card" style={{ overflow: 'auto', padding: 0 }}>
        <div style={{ minWidth: 900 }}>
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `180px repeat(${days.length}, 1fr)`,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorFillTertiary,
            }}
          >
            <div style={{ padding: '10px 12px', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: token.colorTextTertiary }}>
              Membros
            </div>
            {days.map((day, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 0', textAlign: 'center',
                  background: isToday(day) ? token.colorPrimaryBg : undefined,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: isToday(day) ? token.colorPrimary : token.colorText }}>
                  {format(day, 'd')}
                </div>
                <div style={{ fontSize: 10, color: token.colorTextTertiary }}>
                  {weekDays[getDay(day)]}
                </div>
              </div>
            ))}
          </div>

          {/* Member rows */}
          {membros.map((membro) => (
            <div
              key={membro.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${days.length}, 1fr)`,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <div
                style={{
                  padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
                  background: token.colorBgContainer,
                }}
              >
                <div
                  style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}
                >
                  {membro.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <Text style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {membro.nome}
                </Text>
              </div>
              {days.map((day) => {
                const dataStr = format(day, 'yyyy-MM-dd')
                const escala = escalas.find((e) => e.membroId === membro.id && e.data === dataStr)
                const turno = escala ? turnoConfig[escala.turno] : null
                const Icon = turno?.icon
                return (
                  <Tooltip
                    key={dataStr}
                    title={`${membro.nome} - ${turno?.label}`}
                  >
                    <div
                      onClick={() => handleDayClick(membro.id, dataStr)}
                      style={{
                        minHeight: 36,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        background: escala
                          ? `${turno?.color}15`
                          : isToday(day) ? token.colorPrimaryBg : 'transparent',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!escala) e.currentTarget.style.background = token.colorFillTertiary
                      }}
                      onMouseLeave={(e) => {
                        if (!escala) e.currentTarget.style.background = isToday(day) ? token.colorPrimaryBg : 'transparent'
                      }}
                    >
                      {Icon ? (
                        <Icon style={{ fontSize: 16, color: turno?.color }} />
                      ) : (
                        <PlusOutlined style={{ fontSize: 12, color: token.colorTextQuaternary, opacity: 0 }} />
                      )}
                    </div>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </Card>

      <Card className="premium-card" size="small">
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Text strong style={{ fontSize: 13 }}>Legenda</Text>
          {Object.entries(turnoConfig).map(([key, data]) => {
            const Icon = data.icon
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag icon={<Icon />} color={data.color} style={{ borderRadius: 6 }}>
                  {data.label}
                </Tag>
              </div>
            )
          })}
        </div>
      </Card>

      <Modal
        title="Adicionar Turno"
        open={modalOpen}
        onOk={handleAddEscala}
        onCancel={() => setModalOpen(false)}
        okText="Adicionar"
        cancelText="Cancelar"
        width={400}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>{membros.find((m) => m.id === selectedMembro)?.nome}</Text>
          <br />
          <Text type="secondary">
            {selectedData && format(new Date(selectedData), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(Object.entries(turnoConfig) as [Turno, typeof turnoConfig['manha']][]).map(([key, data]) => {
            const Icon = data.icon
            return (
              <div
                key={key}
                onClick={() => setSelectedTurno(key)}
                style={{
                  flex: 1, padding: '16px 8px', borderRadius: 10,
                  border: `2px solid ${selectedTurno === key ? token.colorPrimary : token.colorBorderSecondary}`,
                  background: selectedTurno === key ? token.colorPrimaryBg : 'transparent',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Icon style={{ fontSize: 24, color: selectedTurno === key ? token.colorPrimary : data.color }} />
                <div style={{ marginTop: 4, fontSize: 12, fontWeight: 500 }}>{data.label}</div>
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
