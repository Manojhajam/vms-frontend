"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/api/token"
import Home from "@/components/landingPage/landingPage"

const page = () => {
  const router = useRouter()

  useEffect(() => {
    if (getAuthToken()) {
      router.replace("/dashboard")
    }
  }, [router])

  return (
    <div><Home /></div>
  )
}

export default page