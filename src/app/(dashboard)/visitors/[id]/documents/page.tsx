"use client"

import { use } from "react"
import VisitorDocuments from "@/components/visitor/visitor-documents"

export default function VisitorDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const visitorId = Number(id)

  if (isNaN(visitorId)) {
    return <div>Invalid visitor ID.</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Visitor Documents
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and manage documents for this visitor.
        </p>
      </div>
      <VisitorDocuments visitorId={visitorId} />
    </div>
  )
}
