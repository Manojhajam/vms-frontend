"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Table,
  Card,
  Descriptions,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Upload,
  Spin,
  Alert,
  Popconfirm,
} from "antd"
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons"
import type { UploadFile } from "antd"
import apiClient from "@/lib/api/apiClient"
import {
  getVisitorDocuments,
  createVisitorDocument,
  deleteVisitorDocument,
  getDocumentFileUrl,
  VisitorDocument,
} from "@/services/visitor-document.service"

const DOC_TYPE_LABELS: Record<string, string> = {
  CITIZENSHIP: "Citizenship",
  DRIVING_LICENSE: "Driving License",
  PASSPORT: "Passport",
  OTHER: "Other",
}

const DOC_TYPE_COLORS: Record<string, string> = {
  CITIZENSHIP: "blue",
  DRIVING_LICENSE: "green",
  PASSPORT: "purple",
  OTHER: "default",
}

interface VisitorInfo {
  id: number
  full_name: string
  address: string
  phone: string
  citizenship_no: string
  visitor_type: string
  purpose_of_visit: string
  createdAt: string
}

export default function VisitorDocuments({ visitorId }: { visitorId: number }) {
  const [visitor, setVisitor] = useState<VisitorInfo | null>(null)
  const [documents, setDocuments] = useState<VisitorDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [form] = Form.useForm()

  const fetchDocuments = useCallback(
    async (page: number, limit: number, searchValue: string) => {
      setTableLoading(true)
      try {
        const result = await getVisitorDocuments(visitorId, {
          page,
          limit,
          search: searchValue || undefined,
        })
        setDocuments(result.data)
        setPagination(result.meta)
      } catch {
        setError("Failed to load documents.")
      } finally {
        setTableLoading(false)
      }
    },
    [visitorId]
  )

  useEffect(() => {
    let cancelled = false
    Promise.all([
      apiClient.get(`/visitors/${visitorId}`).then((r) => r.data),
      getVisitorDocuments(visitorId, { page: 1, limit: 10 }),
    ])
      .then(([visitorData, docResult]) => {
        if (!cancelled) {
          setVisitor(visitorData)
          setDocuments(docResult.data)
          setPagination(docResult.meta)
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load visitor information.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [visitorId])

  const handleSearch = (value: string) => {
    setSearch(value)
    fetchDocuments(1, pagination.limit, value)
  }

  const handleTableChange = (page: number, pageSize: number) => {
    fetchDocuments(page, pageSize, search)
  }

  const handleUpload = async () => {
    const values = await form.validateFields()
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("visitor_id", String(visitorId))
      formData.append("document_type", values.document_type)
      formData.append("document_number", values.document_number)
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("file", fileList[0].originFileObj)
      }
      await createVisitorDocument(formData)
      form.resetFields()
      setFileList([])
      setModalOpen(false)
      fetchDocuments(pagination.page, pagination.limit, search)
    } catch {
      // Error handled by apiClient interceptor
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteVisitorDocument(id)
      fetchDocuments(pagination.page, pagination.limit, search)
    } catch {
      // Error handled by apiClient interceptor
    }
  }

  const columns = [
    {
      title: "Document Type",
      dataIndex: "document_type",
      key: "document_type",
      render: (val: string) => (
        <Tag color={DOC_TYPE_COLORS[val] || "default"}>
          {DOC_TYPE_LABELS[val] || val}
        </Tag>
      ),
    },
    {
      title: "Document Number",
      dataIndex: "document_number",
      key: "document_number",
    },
    {
      title: "File",
      dataIndex: "file_path",
      key: "file_path",
      render: (val: string | null) =>
        val ? (
          <Button
            type="link"
            icon={<EyeOutlined />}
            href={getDocumentFileUrl(val)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </Button>
        ) : (
          <span style={{ color: "#999" }}>No file</span>
        ),
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (val: boolean) =>
        val ? (
          <Tag color="success">Verified</Tag>
        ) : (
          <Tag color="warning">Pending</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: VisitorDocument) => (
        <Popconfirm
          title="Delete this document?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ]

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

  return (
    <div>
      {visitor && (
        <Card title="Visitor Information" style={{ marginBottom: 24 }}>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
            <Descriptions.Item label="Full Name">{visitor.full_name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{visitor.phone}</Descriptions.Item>
            <Descriptions.Item label="Citizenship No">{visitor.citizenship_no}</Descriptions.Item>
            <Descriptions.Item label="Address">{visitor.address}</Descriptions.Item>
            <Descriptions.Item label="Visitor Type">{visitor.visitor_type}</Descriptions.Item>
            <Descriptions.Item label="Purpose">{visitor.purpose_of_visit}</Descriptions.Item>
            <Descriptions.Item label="Registered At">
              {new Date(visitor.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card
        title={
          <span>
            <FileTextOutlined /> Documents
          </span>
        }
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              placeholder="Search documents..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 220 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Upload Document
            </Button>
          </div>
        }
      >
        <Table
          dataSource={documents}
          columns={columns}
          rowKey="id"
          loading={tableLoading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} documents`,
            pageSizeOptions: ["10", "20", "50"],
            onChange: handleTableChange,
          }}
        />
      </Card>

      <Modal
        title="Upload Document"
        open={modalOpen}
        onOk={handleUpload}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
          setFileList([])
        }}
        confirmLoading={uploading}
        okText="Upload"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Document Type"
            name="document_type"
            rules={[{ required: true, message: "Please select document type" }]}
          >
            <Select placeholder="Select document type">
              <Select.Option value="CITIZENSHIP">Citizenship</Select.Option>
              <Select.Option value="DRIVING_LICENSE">Driving License</Select.Option>
              <Select.Option value="PASSPORT">Passport</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Document Number"
            name="document_number"
            rules={[{ required: true, message: "Please enter document number" }]}
          >
            <Input placeholder="Enter document number" />
          </Form.Item>
          <Form.Item label="File (PDF, JPEG, PNG - Max 5MB)">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))}
              accept=".pdf,.jpeg,.jpg,.png"
              maxCount={1}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Select File</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
