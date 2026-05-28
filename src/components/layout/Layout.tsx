import { useState } from 'react'
import {
  Layout as AntLayout, theme, Button, App as AntApp, Form, Input,
  Typography, Tag,
} from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { DEFAULT_USER, TEST_USERS, type AppUser } from '../../lib/auth'

const { Content } = AntLayout
const { Title, Text } = Typography

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
  '/membros': { title: 'Membros', subtitle: 'Gestão da equipe' },
  '/times': { title: 'Times', subtitle: 'Organização por grupos' },
  '/tarefas': { title: 'Tarefas', subtitle: 'Kanban e acompanhamento' },
  '/escala': { title: 'Escala', subtitle: 'Gestão de turnos' },
  '/relatorios': { title: 'Relatórios', subtitle: 'Análise de produtividade' },
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginForm] = Form.useForm()
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const stored = localStorage.getItem('equipepro:currentUser')
    if (stored) return JSON.parse(stored)
    return localStorage.getItem('equipepro:loggedOut') === 'true' ? null : DEFAULT_USER
  })
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? { title: 'EquipePro', subtitle: '' }
  const { token } = theme.useToken()
  const { modal, message } = AntApp.useApp()

  function handleLogout() {
    modal.confirm({
      title: 'Sair do sistema?',
      content: 'Sua sessao sera encerrada neste navegador.',
      okText: 'Sair',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.setItem('equipepro:loggedOut', 'true')
        localStorage.removeItem('equipepro:currentUser')
        setCurrentUser(null)
        setMobileOpen(false)
        message.success('Sessao encerrada')
      },
    })
  }

  function handleLogin(values: { username: string; password: string }) {
    const user = TEST_USERS.find((item) =>
      item.username === values.username && item.password === values.password
    )

    if (!user) {
      message.error('Usuario ou senha invalidos')
      return
    }

    localStorage.removeItem('equipepro:loggedOut')
    localStorage.setItem('equipepro:currentUser', JSON.stringify(user))
    setCurrentUser(user)
    message.success('Sessao iniciada')
  }

  if (!currentUser) {
    return (
      <AntLayout
        className="min-h-screen premium-bg"
        style={{
          minHeight: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'minmax(360px, 0.95fr) minmax(420px, 1.05fr)',
          }}
        >
          <div
            style={{
              minHeight: '100vh',
              padding: '48px clamp(32px, 6vw, 72px)',
              background: token.colorFillQuaternary,
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 32,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 19,
              }}
            >
              E
            </div>
            <div style={{ maxWidth: 460 }}>
              <Title level={1} style={{ margin: 0, letterSpacing: '-0.04em' }}>EquipePro</Title>
              <Text type="secondary" style={{ display: 'block', marginTop: 12, lineHeight: 1.6, fontSize: 15 }}>
                Acesse o painel para acompanhar membros, times, tarefas e relatorios da equipe.
              </Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
              <Text strong style={{ fontSize: 12 }}>Acessos para teste</Text>
              {TEST_USERS.map((user) => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => loginForm.setFieldsValue({ username: user.username, password: user.password })}
                  style={{
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorBgContainer,
                    borderRadius: 10,
                    padding: '11px 12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <span>
                      <Text strong style={{ fontSize: 13 }}>{user.username}</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}> / {user.password}</Text>
                    </span>
                    <Tag style={{ marginRight: 0 }}>{user.role}</Tag>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              minHeight: '100vh',
              padding: '48px clamp(32px, 7vw, 96px)',
              background: token.colorBgContainer,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', maxWidth: 420 }}>
              <div style={{ marginBottom: 28 }}>
                <Title level={2} style={{ margin: 0, letterSpacing: '-0.03em' }}>Entrar</Title>
                <Text type="secondary">Informe suas credenciais para continuar.</Text>
              </div>

              <Form
                form={loginForm}
                layout="vertical"
                onFinish={handleLogin}
                initialValues={{ username: 'admin', password: 'admin123' }}
              >
                <Form.Item name="username" label="Usuario" rules={[{ required: true, message: 'Informe o usuario' }]}>
                  <Input size="large" placeholder="admin" />
                </Form.Item>
                <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe a senha' }]}>
                  <Input.Password size="large" placeholder="admin123" />
                </Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Entrar
                </Button>
              </Form>

              <div
                style={{
                  marginTop: 18,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: token.colorFillQuaternary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>Usuario inicial</Text>
                <Text strong style={{ fontSize: 12 }}>admin / admin123</Text>
              </div>
            </div>
          </div>
        </div>
      </AntLayout>
    )
  }

  return (
    <AntLayout className="min-h-screen premium-bg">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <AntLayout
        style={{
          position: 'relative',
        }}
      >
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
        <Content
          className="overflow-y-auto"
          style={{
            padding: 32,
            maxHeight: 'calc(100vh - 64px)',
          }}
        >
          <div
            className="max-w-7xl mx-auto"
            style={{
              background: token.colorBgContainer,
              borderRadius: 16,
              padding: '28px 32px',
              minHeight: 'calc(100vh - 64px - 96px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.02)',
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  )
}
