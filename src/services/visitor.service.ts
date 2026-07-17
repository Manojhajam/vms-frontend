import apiClient from "@/lib/api/apiClient"

export interface Visitor {
  id: number
  full_name: string
  address: string
  phone: string
  citizenship_no: string
  visitor_type: "CITIZEN" | "VENDOR" | "CONTRACTOR" | "NGO" | "POLICE" | "OTHER"
  purpose_of_visit: string
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface VisitorListResponse {
  message: string
  data: Visitor[]
  meta: PaginationMeta
}

export interface VisitorQueryParams {
  page?: number
  limit?: number
  search?: string
}

export async function getVisitors(params?: VisitorQueryParams): Promise<VisitorListResponse> {
  const response = await apiClient.get<VisitorListResponse>("/visitors", { params })
  return response.data
}

export async function getAllVisitors(): Promise<Visitor[]> {
  const response = await apiClient.get<VisitorListResponse>("/visitors", {
    params: { limit: 10000 },
  })
  return response.data.data
}
