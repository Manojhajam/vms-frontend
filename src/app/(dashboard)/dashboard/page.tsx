"use client"

import { useEffect, useState } from "react"
import { Table, Card, Row, Col, Statistic, Spin, Alert } from "antd"
import { TeamOutlined } from "@ant-design/icons"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getVisitors, Visitor } from "@/lib/api/visitor"

const PURPOSE_COLORS: Record<string, string> = {
  business_meeting: "#1890ff",
  interview: "#52c41a",
  delivery: "#faad14",
  maintenance: "#ff4d4f",
  official_visit: "#722ed1",
  personal: "#13c2c2",
  other: "#8c8c8c",
}

const PURPOSE_LABELS: Record<string, string> = {
  business_meeting: "Business Meeting",
  interview: "Interview",
  delivery: "Delivery",
  maintenance: "Maintenance",
  official_visit: "Official Visit",
  personal: "Personal",
  other: "Other",
}

export default function DashboardPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getVisitors()
      .then(setVisitors)
      .catch((err: { response?: { status?: number } }) => {
        if (err.response?.status === 403) {
          setError("Access Denied: You need Admin privileges to view visitors.")
        } else {
          setError("Failed to load visitors. Please try again later.")
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return <Alert type="warning" message={error} showIcon />
  }

  const purposeData = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      acc[v.purpose_of_visit] = (acc[v.purpose_of_visit] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name: PURPOSE_LABELS[name] || name, value }))

  const timeData = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      const date = new Date(v.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const columns = [
    { title: "Full Name", dataIndex: "full_name", key: "full_name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Citizenship No", dataIndex: "citizenship_no", key: "citizenship_no" },
    {
      title: "Purpose of Visit",
      dataIndex: "purpose_of_visit",
      key: "purpose_of_visit",
      render: (val: string) => PURPOSE_LABELS[val] || val,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
  ]

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Visitors" value={visitors.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Today"
              value={
                visitors.filter((v) => {
                  const d = new Date(v.createdAt)
                  const now = new Date()
                  return d.toDateString() === now.toDateString()
                }).length
              }
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="This Week"
              value={
                visitors.filter((v) => {
                  const d = new Date(v.createdAt)
                  const now = new Date()
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                  return d >= weekAgo
                }).length
              }
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Visitors by Purpose">
            {purposeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={purposeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {purposeData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PURPOSE_COLORS[Object.keys(PURPOSE_LABELS).find((k) => PURPOSE_LABELS[k] === entry.name) || "other"] || "#8c8c8c"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                No data available
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Visitors Over Time">
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Visitors" fill="#1890ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                No data available
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="All Visitors">
        <Table dataSource={visitors} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
