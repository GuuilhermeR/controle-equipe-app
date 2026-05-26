import { Card, Row, Col, Statistic, Tag, Badge, theme } from 'antd'
import {
  TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons'

const stats = [
  {
    label: 'Total Membros', value: '12', icon: TeamOutlined,
    change: '+2', positive: true,
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  },
  {
    label: 'Tarefas Concluídas', value: '24', icon: CheckCircleOutlined,
    change: '+18%', positive: true,
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    label: 'Em Andamento', value: '8', icon: ClockCircleOutlined,
    change: '+3', positive: true,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    label: 'Pendentes', value: '5', icon: ExclamationCircleOutlined,
    change: '-2', positive: false,
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
]

const activities = [
  { action: 'Ana Silva concluiu', task: 'Revisar protótipos', time: '2 horas atrás', color: '#10b981', bg: '#ecfdf5' },
  { action: 'Carlos iniciou', task: 'Criar página de login', time: '4 horas atrás', color: '#f59e0b', bg: '#fffbeb' },
  { action: 'Pedro entrou de férias', task: '', time: '1 dia atrás', color: '#8b5cf6', bg: '#f5f3ff' },
  { action: 'Nova tarefa atribuída', task: 'Testar API REST', time: '2 dias atrás', color: '#4f46e5', bg: '#eef2ff' },
]

export default function Dashboard() {
  const { token } = theme.useToken()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: token.colorText, letterSpacing: '-0.03em' }}>
            Dashboard
          </h2>
          <p style={{ color: token.colorTextTertiary, marginTop: 2 }}>Bem-vindo de volta! Aqui está o resumo da sua equipe.</p>
        </div>
        <Badge status="success" text={<span style={{ color: token.colorTextTertiary, fontSize: 13 }}>Online</span>} />
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <Card className="premium-card" hoverable>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: stat.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <stat.icon style={{ fontSize: 20, color: '#fff' }} />
                </div>
                <Tag
                  color={stat.positive ? 'success' : 'error'}
                  style={{ marginRight: 0, borderRadius: 6, fontSize: 11, lineHeight: '20px' }}
                >
                  {stat.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {' '}{stat.change}
                </Tag>
              </div>
              <Statistic
                title={<span style={{ color: token.colorTextTertiary, fontSize: 13 }}>{stat.label}</span>}
                value={stat.value}
                valueStyle={{ fontSize: 28, fontWeight: 700, color: token.colorText }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className="premium-card"
            title={<span style={{ fontSize: 15, fontWeight: 600 }}>Membros por Time</span>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { time: 'Frontend', count: 4, color: '#4f46e5' },
                { time: 'Backend', count: 3, color: '#f59e0b' },
                { time: 'Design', count: 2, color: '#ec4899' },
              ].map((item) => (
                <div key={item.time}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: token.colorTextSecondary }}>{item.time}</span>
                    <span style={{ fontWeight: 600, color: token.colorText }}>{item.count}</span>
                  </div>
                  <div
                    style={{
                      height: 8, borderRadius: 4, background: token.colorFill,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%', borderRadius: 4,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                        width: `${(item.count / 4) * 100}%`,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="premium-card"
            title={<span style={{ fontSize: 15, fontWeight: 600 }}>Tarefas por Status</span>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'A Fazer', count: 5, color: '#9ca3af' },
                { label: 'Fazendo', count: 8, color: '#4f46e5' },
                { label: 'Concluído', count: 24, color: '#10b981' },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: token.colorTextSecondary }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: token.colorText }}>{item.count}</span>
                  </div>
                  <div
                    style={{
                      height: 8, borderRadius: 4, background: token.colorFill,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%', borderRadius: 4,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                        width: `${(item.count / 24) * 100}%`,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        className="premium-card"
        title={<span style={{ fontSize: 15, fontWeight: 600 }}>Atividade Recente</span>}
        extra={<a style={{ fontSize: 12 }}>Ver todas</a>}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {activities.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 12, padding: '12px 0',
                borderBottom: i < activities.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
              }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: item.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: token.colorTextSecondary, margin: 0 }}>
                  {item.action}
                  {item.task && <strong style={{ color: token.colorText }}> {item.task}</strong>}
                </p>
                <p style={{ fontSize: 12, color: token.colorTextTertiary, margin: '2px 0 0' }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
