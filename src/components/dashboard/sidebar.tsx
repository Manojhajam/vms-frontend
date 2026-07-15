"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Layout, Menu, Button, App, theme } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import {
  DashboardOutlined,
  TeamOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"
import { clearAuthToken } from "@/lib/api/token"
import { ThemeToggle } from "@/components/theme/theme-toggle"

const { Sider, Header, Content } = Layout

const menuItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/visitors", icon: <TeamOutlined />, label: "Visitors" },
  { key: "/pre-registration", icon: <FormOutlined />, label: "Pre-Registration" },
]

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/visitors": "Visitors",
  "/pre-registration": "Pre-Registration",
}

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()
  const { modal } = App.useApp()

  const onMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  const onLogout = () => {
    modal.confirm({
      title: "Logout",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        clearAuthToken()
        window.location.href = "/login"
      },
    })
  }

  const selectedKey = "/" + pathname.split("/").filter(Boolean).slice(0, 2).join("/")

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        theme="dark"
      >
        <div className="flex h-8 items-center justify-center text-lg font-bold text-white">
          {collapsed ? "V" : "VMS"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={onMenuClick}
        />
        <div className="absolute bottom-4 left-0 w-full">
          <Menu theme="dark" mode="inline" items={[
            { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
          ]} onClick={onLogout} />
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: "0 16px", background: colorBgContainer, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <span style={{ fontSize: 16, fontWeight: 600 }}>{routeTitles[selectedKey] ?? "Dashboard"}</span>
          </div>
          <ThemeToggle />
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
