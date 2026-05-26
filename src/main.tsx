import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme, App as AntApp } from 'antd'
import { useTheme } from './store/useTheme'
import ptBR from 'antd/locale/pt_BR'
import './index.css'
import App from './App'

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const currentTheme = useTheme((s) => s.theme)
  const isDark = currentTheme === 'dark'

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f46e5',
          colorPrimaryHover: '#6366f1',
          borderRadius: 10,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
          colorBgElevated: isDark ? '#2a2a2a' : '#ffffff',
          colorBorderSecondary: isDark ? '#303030' : '#f0f0f0',
        },
        components: {
          Layout: {
            headerBg: isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)',
            bodyBg: 'transparent',
            siderBg: isDark ? '#1a1a1a' : '#ffffff',
          },
          Menu: {
            itemBg: 'transparent',
            itemBorderRadius: 8,
            itemMarginInline: 8,
            itemMarginBlock: 2,
          },
          Card: {
            borderRadiusLG: 12,
            paddingLG: 20,
          },
          Button: {
            borderRadiusLG: 10,
            borderRadius: 8,
            controlHeightLG: 44,
            controlHeight: 36,
            controlHeightSM: 28,
          },
          Table: {
            borderRadius: 10,
            headerBg: isDark ? '#1a1a1a' : '#fafafa',
            rowHoverBg: isDark ? '#2a2a2a' : '#f5f5f5',
          },
          Modal: {
            borderRadiusLG: 12,
          },
          Tag: {
            borderRadiusSM: 6,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 36,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 36,
          },
        },
      }}
    >
      <AntApp>
        {children}
      </AntApp>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </StrictMode>
)
