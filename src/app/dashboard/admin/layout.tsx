"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/utils"
import SessionLoading from "@/components/session-checking"

const ADMIN_EMAIL = "admin.cse@gmail.com"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user is admin
        if (user.email === ADMIN_EMAIL) {
          setIsAdmin(true)
        } else {
          // Redirect non-admin users to regular dashboard
          router.push("/dashboard")
          return
        }
      } else {
        // Redirect to auth if not authenticated
        router.push("/auth")
        return
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <SessionLoading />
  }

  if (!isAdmin) {
    return <SessionLoading />
  }

  return <>{children}</>
}
