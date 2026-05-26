import { Card, Row, Col, Statistic, Table, Tag, Button, Typography, theme, Space } from 'antd'
import {
  DownloadOutlined, FileTextOutlined,   BarChartOutlined,
  CheckCircleOutlined, SyncOutlined,
} from '@ant-design/icons'
import { useMembros } from '../store/useMembros'
import { useTarefas } from '../store/useTarefas'
import { useTimes } from '../store/useTimes'

const { Text, Title } = Typography

export default function Relatorios() {
  const { membros } = useMembros()
  const { tarefas } = useTarefas()
  const { times } = useTimes()
  const { token } = theme.useToken()

  const totalTarefas = tarefas.length
  const concluidas = tarefas.filter((t) => t.status === 'done').length
  const emAndamento = tarefas.filter((t) => t.status === 'doing').length
  const produtividadeMedia = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0

  function exportCSV() {
    const headers = ['Membro', 'Time', 'Cargo', 'Status', 'Total Tarefas', 'Concluídas', 'Andamento', 'Pendentes', '% Produtividade']
    const rows = membros.map((m) => {
      const time = times.find((t) => t.id === m.timeId)
      const tarefasMembro = tarefas.filter((t) => t.responsavelId === m.id)
      const conc = tarefasMembro.filter((t) => t.status === 'done').length
      const and = tarefasMembro.filter((t) => t.status === 'doing').length
      const pend = tarefasMembro.filter((t) => t.status === 'todo').length
      const perc = tarefasMembro.length > 0 ? Math.round((conc / tarefasMembro.length) * 100) : 0
      return [m.nome, time?.nome ?? '', m.cargo, m.status, tarefasMembro.length, conc, and, pend, `${perc}%`]
    })
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-equipes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = [
    { label: 'Total de Tarefas', value: totalTarefas, icon: FileTextOutlined, gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
    { label: 'Concluídas', value: concluidas, icon: CheckCircleOutlined, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'Em Andamento', value: emAndamento, icon: SyncOutlined, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { label: 'Produtividade', value: `${produtividadeMedia}%`, icon: BarChartOutlined, gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  ]

  const columns = [
    {
      title: 'Membro',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome: string) => (
        <Space>
          <div
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#fff',
            }}
          >
            {nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <Text strong>{nome}</Text>
        </Space>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timeId',
      key: 'time',
      render: (timeId: string) => {
        const t = times.find((tm) => tm.id === timeId)
        return t ? <Tag color={t.cor} style={{ borderRadius: 4 }}>{t.nome}</Tag> : '-'
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'center' as const,
      render: (v: number) => <Text strong>{v}</Text>,
    },
    {
      title: 'Concluídas',
      dataIndex: 'concluidas',
      key: 'concluidas',
      align: 'center' as const,
      render: (v: number) => <Text style={{ color: '#10b981', fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'Andamento',
      dataIndex: 'andamento',
      key: 'andamento',
      align: 'center' as const,
      render: (v: number) => <Text style={{ color: '#f59e0b', fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'Pendentes',
      dataIndex: 'pendentes',
      key: 'pendentes',
      align: 'center' as const,
      render: (v: number) => <Text style={{ color: '#ef4444', fontWeight: 600 }}>{v}</Text>,
    },
    {
      title: 'Produtividade',
      dataIndex: 'perc',
      key: 'perc',
      align: 'center' as const,
      render: (perc: number) => (
        <Space>
          <div
            style={{
              width: 80, height: 6, borderRadius: 3,
              background: token.colorFill,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%', borderRadius: 3,
                background: `linear-gradient(90deg, #4f46e5, #7c3aed)`,
                width: `${perc}%`,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, minWidth: 32 }}>{perc}%</Text>
        </Space>
      ),
    },
  ]

  const dataSource = membros.map((m) => {
    const tarefasMembro = tarefas.filter((t) => t.responsavelId === m.id)
    const conc = tarefasMembro.filter((t) => t.status === 'done').length
    const and = tarefasMembro.filter((t) => t.status === 'doing').length
    const pend = tarefasMembro.filter((t) => t.status === 'todo').length
    const perc = tarefasMembro.length > 0 ? Math.round((conc / tarefasMembro.length) * 100) : 0
    return { ...m, key: m.id, total: tarefasMembro.length, concluidas: conc, andamento: and, pendentes: pend, perc }
  })

  return (
    <div className="space-y-5">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.03em' }}>Relatórios</Title>
          <Text type="secondary">Análise de produtividade da equipe</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={exportCSV}>
            Exportar CSV
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <Card className="premium-card" hoverable>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: stat.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <stat.icon style={{ fontSize: 20, color: '#fff' }} />
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

      <Card
        className="premium-card premium-table"
        title={<span style={{ fontSize: 15, fontWeight: 600 }}>Produtividade por Membro</span>}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="middle"
          className="premium-table"
        />
      </Card>
    </div>
  )
}
