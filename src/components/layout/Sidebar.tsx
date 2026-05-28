import {
  LayoutDashboard, Users, Building2, Kanban, CalendarDays, BarChart3,
  ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import { cn } from '../../lib/utils'
import type { AppUser } from '../../lib/auth'

const { Sider } = Layout

const menuItems = [
  { key: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { key: '/membros', icon: Users, label: 'Membros' },
  { key: '/times', icon: Building2, label: 'Times' },
  { key: '/tarefas', icon: Kanban, label: 'Tarefas' },
  { key: '/escala', icon: CalendarDays, label: 'Escala' },
  { key: '/relatorios', icon: BarChart3, label: 'Relatórios' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  onLogout: () => void
  currentUser: AppUser
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, onLogout, currentUser }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={72}
        className={`!fixed lg:!sticky top-0 left-0 h-screen z-50 !border-r ${
          mobileOpen ? '!translate-x-0' : '!-translate-x-full lg:!translate-x-0'
        }`}
        style={{
          borderColor: token.colorBorderSecondary,
          transition: 'transform 0.3s ease, width 0.3s ease',
        }}
      >
        <div
          className="flex items-center border-b"
          style={{
            padding: collapsed ? '16px 0' : '16px 20px',
            minHeight: 72,
            borderColor: token.colorBorderSecondary,
          }}
        >
          <div className={cn('flex items-center gap-3 w-full', collapsed && 'justify-center')}>
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 40, height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
              }}
            >
              <Users size={20} className="text-white" />
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 18, fontWeight: 700,
                    color: token.colorText,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                  }}
                >
                  EquipePro
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: token.colorTextTertiary,
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  Controle de Equipes
                </div>
              </div>
            )}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            key: item.key,
            icon: <item.icon size={19} />,
            label: item.label,
            onClick: () => {
              navigate(item.key)
              onMobileClose()
            },
          }))}
          className="!border-r-0 !bg-transparent"
          style={{ marginTop: 4 }}
        />

        {!collapsed && (
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              padding: '12px 16px 16px',
              borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <div
              className="flex items-center gap-3 rounded-lg"
              style={{
                padding: '10px 12px',
                background: token.colorFillTertiary,
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                }}
              >
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>
                  {currentUser.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13, fontWeight: 600,
                    color: token.colorText,
                    lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {currentUser.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: token.colorTextTertiary,
                    lineHeight: 1.3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {currentUser.email}
                </div>
              </div>
              <LogOut
                size={15}
                aria-label="Sair"
                onClick={onLogout}
                style={{ color: token.colorTextTertiary, flexShrink: 0, cursor: 'pointer' }}
              />
            </div>

            <div
              className="flex items-center justify-center gap-1.5 cursor-pointer rounded-lg"
              style={{
                marginTop: 8,
                padding: '6px 0',
                color: token.colorTextTertiary,
                fontSize: 12,
              }}
              onClick={onToggle}
            >
              <ChevronLeft size={14} />
              <span>Recolher</span>
            </div>
          </div>
        )}
      </Sider>

      {collapsed && (
        <div
          className="fixed bottom-4 left-[18px] z-50 hidden lg:block cursor-pointer"
          style={{
            padding: 8, borderRadius: 10,
            background: token.colorBgElevated,
            boxShadow: token.boxShadow,
          }}
          onClick={onToggle}
        >
          <ChevronRight size={16} style={{ color: token.colorTextTertiary }} />
        </div>
      )}
    </>
  )
}
