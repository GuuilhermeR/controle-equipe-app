import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout, Button, theme, Avatar, Badge, Input, Popover,
  List, Typography, Empty, Dropdown, App, Tag,
} from 'antd'
import {
  MenuOutlined, BellOutlined, SearchOutlined,
  SunOutlined, MoonOutlined, UserOutlined, LogoutOutlined,
} from '@ant-design/icons'
import { useTheme } from '../../store/useTheme'
import { useTarefas } from '../../store/useTarefas'
import { useMembros } from '../../store/useMembros'
import { useTimes } from '../../store/useTimes'
import { TEST_USERS, type AppUser } from '../../lib/auth'

const { Header: AntHeader } = Layout
const { Text } = Typography
const headerIconButtonStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 10,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

interface HeaderProps {
  title: string
  subtitle: string
  onMenuClick: () => void
  onLogout: () => void
  currentUser: AppUser
}

export function Header({ title, subtitle, onMenuClick, onLogout, currentUser }: HeaderProps) {
  const { theme: currentTheme, toggle } = useTheme()
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const tarefas = useTarefas((s) => s.tarefas)
  const membros = useMembros((s) => s.membros)
  const times = useTimes((s) => s.times)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('equipepro:readNotifications') ?? '[]')
  )

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []

    return [
      ...tarefas.map((tarefa) => ({
        value: `tarefa:${tarefa.id}`,
        title: tarefa.titulo,
        description: tarefa.descricao || 'Tarefa',
        type: 'Tarefa',
        path: '/tarefas',
      })),
      ...membros.map((membro) => ({
        value: `membro:${membro.id}`,
        title: membro.nome,
        description: membro.cargo,
        type: 'Membro',
        path: '/membros',
      })),
      ...times.map((time) => ({
        value: `time:${time.id}`,
        title: time.nome,
        description: time.descricao,
        type: 'Time',
        path: '/times',
      })),
    ]
      .filter((item) =>
        `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(query)
      )
      .slice(0, 6)
  }, [membros, search, tarefas, times])

  const overdueTasks = tarefas.filter((tarefa) =>
    tarefa.status !== 'done' && tarefa.prazo && new Date(tarefa.prazo) < new Date(new Date().toDateString())
  )
  const urgentTasks = tarefas.filter((tarefa) => tarefa.status !== 'done' && tarefa.prioridade === 'urgente')
  const notifications = [
    ...overdueTasks.map((tarefa) => ({
      id: `overdue-${tarefa.id}`,
      title: tarefa.titulo,
      description: 'Prazo vencido',
      color: token.colorError,
    })),
    ...urgentTasks.map((tarefa) => ({
      id: `urgent-${tarefa.id}`,
      title: tarefa.titulo,
      description: 'Prioridade urgente',
      color: token.colorWarning,
    })),
  ].slice(0, 5)
  const unreadNotifications = notifications.filter((item) => !readNotificationIds.includes(item.id))

  function markNotificationAsRead(id: string) {
    setReadNotificationIds((current) => {
      const next = current.includes(id) ? current : [...current, id]
      localStorage.setItem('equipepro:readNotifications', JSON.stringify(next))
      return next
    })
  }

  function markAllNotificationsAsRead() {
    const next = Array.from(new Set([...readNotificationIds, ...notifications.map((item) => item.id)]))
    localStorage.setItem('equipepro:readNotifications', JSON.stringify(next))
    setReadNotificationIds(next)
  }

  function handleSearchSelect(value: string) {
    const result = searchResults.find((item) => item.value === value)
    if (!result) return
    navigate(result.path)
    setSearch('')
  }

  function handleSearchSubmit() {
    if (searchResults[0]) {
      handleSearchSelect(searchResults[0].value)
    } else if (search.trim()) {
      message.info('Nenhum resultado encontrado')
    }
  }

  const searchDropdownOpen = searchFocused && search.trim().length > 0
  const searchDropdown = (
    <div style={{ width: 340, padding: 6 }}>
      {searchResults.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum resultado" style={{ margin: '10px 0' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {searchResults.map((result) => (
            <button
              key={result.value}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSearchSelect(result.value)}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 8,
                background: 'transparent',
                padding: '8px 10px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tag style={{ margin: 0, borderRadius: 6, fontSize: 11 }}>{result.type}</Tag>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 13 }}>{result.title}</Text>
                  <Text type="secondary" ellipsis style={{ fontSize: 12 }}>{result.description}</Text>
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text strong>Notificacoes</Text>
        {unreadNotifications.length > 0 && (
          <Button type="link" size="small" onClick={markAllNotificationsAsRead} style={{ padding: 0 }}>
            Marcar todas como lidas
          </Button>
        )}
      </div>
      {notifications.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhuma notificacao" />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => {
            const isRead = readNotificationIds.includes(item.id)

            return (
              <List.Item
                style={{ paddingInline: 0, cursor: 'pointer', opacity: isRead ? 0.58 : 1 }}
                onClick={() => navigate('/tarefas')}
                actions={[
                  isRead ? (
                    <Tag key="read" style={{ marginRight: 0 }}>Lida</Tag>
                  ) : (
                    <Button
                      key="mark-read"
                      type="link"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation()
                        markNotificationAsRead(item.id)
                      }}
                    >
                      Marcar como lida
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={<span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block', marginTop: 8 }} />}
                  title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                  description={<Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>}
                />
              </List.Item>
            )
          }}
        />
      )}
    </div>
  )

  return (
    <AntHeader
      className="sticky top-0 z-30 flex items-center justify-between"
      style={{
        height: 64,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingInline: 24,
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          className="lg:hidden"
          icon={<MenuOutlined />}
          onClick={onMenuClick}
          style={{
            color: token.colorTextTertiary,
            width: 36, height: 36,
          }}
        />
        <div>
          <h1 className="text-lg font-bold" style={{ color: token.colorText, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {title}
          </h1>
          <p className="text-xs" style={{ color: token.colorTextTertiary, margin: 0 }}>{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Popover
          open={searchDropdownOpen}
          content={searchDropdown}
          trigger="click"
          placement="bottomLeft"
          styles={{ content: { padding: 0 } }}
        >
          <Input
            placeholder="Buscar..."
            prefix={<SearchOutlined style={{ color: searchFocused ? token.colorPrimary : token.colorTextTertiary }} />}
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
            onPressEnter={handleSearchSubmit}
            style={{
              width: 340,
              maxWidth: '34vw',
              height: 40,
              borderRadius: 10,
              background: token.colorFillQuaternary,
              border: `1px solid ${searchFocused ? token.colorPrimary : token.colorBorderSecondary}`,
              boxShadow: searchFocused
                ? '0 0 0 3px rgba(79,70,229,0.12)'
                : '0 1px 2px rgba(15,23,42,0.04)',
              transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
            }}
            size="middle"
          />
        </Popover>

        <Popover trigger="click" placement="bottomRight" content={notificationContent}>
          <Badge count={unreadNotifications.length} size="small" offset={[-4, 4]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 18 }} />}
              style={{
                ...headerIconButtonStyle,
                color: token.colorTextTertiary,
                background: token.colorFillQuaternary,
              }}
            />
          </Badge>
        </Popover>

        <div style={{ width: 1, height: 24, background: token.colorBorderSecondary, margin: '0 2px' }} />

        <Button
          type="text"
          icon={currentTheme === 'dark' ? <SunOutlined style={{ fontSize: 18 }} /> : <MoonOutlined style={{ fontSize: 18 }} />}
          onClick={toggle}
          style={{
            ...headerIconButtonStyle,
            color: token.colorTextTertiary,
            background: token.colorFillQuaternary,
          }}
          title={currentTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        />

        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'user', label: currentUser.name, icon: <UserOutlined />, disabled: true },
              { key: 'role', label: currentUser.role, disabled: true },
              { type: 'divider' },
              { key: 'test-access-title', label: 'Acessos de teste', disabled: true },
              ...TEST_USERS.map((user) => ({
                key: `test-${user.username}`,
                label: `${user.username} / ${user.password}`,
                disabled: true,
              })),
              { type: 'divider' },
              { key: 'logout', label: 'Sair', icon: <LogoutOutlined />, danger: true },
            ],
            onClick: ({ key }) => {
              if (key === 'logout') onLogout()
            },
          }}
        >
          <Avatar
            size={34}
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {currentUser.name.slice(0, 1).toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  )
}
