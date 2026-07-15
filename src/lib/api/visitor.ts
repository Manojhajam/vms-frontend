import apiClient from "./apiClient"

export interface Visitor {
  id: number
  full_name: string
  address: string
  phone: string
  citizenship_no: string
  purpose_of_visit: string
  createdAt: string
  updatedAt: string
}

interface VisitorListResponse {
  message: string
  data: Visitor[]
}

export async function getVisitors(): Promise<Visitor[]> {
  const response = await apiClient.get<VisitorListResponse>("/visitors")
  return response.data.data
}
