import { useState } from 'react'
import { Layout as AntLayout, theme } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const { Content } = AntLayout

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
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? { title: 'EquipePro', subtitle: '' }
  const { token } = theme.useToken()

  return (
    <AntLayout className="min-h-screen premium-bg">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
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
