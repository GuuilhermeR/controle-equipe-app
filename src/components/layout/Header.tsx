import { Layout, Button, theme, Avatar, Badge, Input } from 'antd'
import {
  MenuOutlined, BellOutlined, SearchOutlined,
  SunOutlined, MoonOutlined, UserOutlined,
} from '@ant-design/icons'
import { useTheme } from '../../store/useTheme'

const { Header: AntHeader } = Layout

interface HeaderProps {
  title: string
  subtitle: string
  onMenuClick: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { theme: currentTheme, toggle } = useTheme()
  const { token } = theme.useToken()

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
        <Input
          placeholder="Buscar..."
          prefix={<SearchOutlined style={{ color: token.colorTextQuaternary }} />}
          variant="filled"
          style={{
            width: 220,
            borderRadius: 8,
            background: token.colorFillTertiary,
          }}
          size="middle"
        />

        <Badge dot offset={[-3, 3]}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{
              color: token.colorTextTertiary,
              width: 36, height: 36,
            }}
          />
        </Badge>

        <div style={{ width: 1, height: 24, background: token.colorBorderSecondary, margin: '0 2px' }} />

        <Button
          type="text"
          icon={currentTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggle}
          style={{
            color: token.colorTextTertiary,
            width: 36, height: 36,
          }}
          title={currentTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        />

        <Avatar
          size={34}
          icon={<UserOutlined />}
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        />
      </div>
    </AntHeader>
  )
}
