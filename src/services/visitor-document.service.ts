import apiClient from "@/lib/api/apiClient"
import { API_CONFIG } from "@/lib/api/config"

export interface VisitorDocument {
  id: number
  visitor_id: number
  document_type: "CITIZENSHIP" | "DRIVING_LICENSE" | "PASSPORT" | "OTHER"
  document_number: string
  file_path: string | null
  is_verified: boolean
  verified_at: string | null
  verified_by: number | null
  createdAt: string
  updatedAt: string
}

export interface VisitorDocumentListResponse {
  message: string
  data: VisitorDocument[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface VisitorDocumentQueryParams {
  page?: number
  limit?: number
  search?: string
  visitor_id?: number
}

export async function getVisitorDocuments(
  visitorId: number,
  params?: Omit<VisitorDocumentQueryParams, "visitor_id">
): Promise<VisitorDocumentListResponse> {
  const response = await apiClient.get<VisitorDocumentListResponse>("/visitor-documents", {
    params: { ...params, visitor_id: visitorId },
  })
  return response.data
}

export async function createVisitorDocument(formData: FormData) {
  const response = await apiClient.post("/visitor-documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export async function deleteVisitorDocument(id: number) {
  const response = await apiClient.delete(`/visitor-documents/${id}`)
  return response.data
}

export function getDocumentFileUrl(filename: string): string {
  const base = API_CONFIG.baseURL?.replace(/\/$/, "") || "http://localhost:4000/api"
  return `${base}/visitor-documents/file/${filename}`
}
