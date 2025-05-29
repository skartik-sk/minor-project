"use client"
import SessionLoading from "@/components/session-checking"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/utils"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { Home, LogOut, Menu, PanelRight, PlusCircle, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Create Project", href: "/dashboard/create", icon: PlusCircle },
  ]

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/auth")
    } catch (error) {
      console.error("Sign-out error:", error)
    }
  }

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        setLoading(false)
      } else {
        setIsAuthenticated(false)
        setLoading(false)
        router.push("/auth")  // Redirect if not authenticated
      }
    })
    return () => unsubscribe()
  }, [router])


  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])
  

  // Show loading until authentication is checked
  if (loading || isAuthenticated == false) {
    return <SessionLoading />
  }

  // Close the mobile sidebar when clicking outside of it
  const handleBackdropClick = () => {
    setMobileOpen(false)
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] bg-background">
        {/* Topbar */}
        <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:hidden transition-all">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <span className="text-xl font-semibold">Minor Projects</span>
        </div>

        {/* Mobile Sidebar - appears BELOW the topbar */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
            onClick={handleBackdropClick} // Click on backdrop to close sidebar
          />
        )}
        <aside
          className={`fixed top-16 left-0 z-30 h-[calc(100dvh-4rem)] w-72 transform border-r bg-background transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="mt-4 space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-accent text-foreground" // active state using shadcn's text-foreground color
                    : "text-muted-foreground hover:bg-accent/20 hover:text-foreground" // default and hover states with shadcn's colors
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="mt-4 w-full justify-start text-destructive hover:bg-destructive" // shadcn's destructive color for logout
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </nav>
        </aside>

<div className="hidden lg:flex">
  {sidebarOpen && (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
      <div className="flex  gap-4 items-center">
        <h1 className="text-xl font-bold">Minor Projects</h1>
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setSidebarOpen(false)}>
          <PanelRight className="h-5 w-5 "  />
        </Button>
      </div>
        
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )}

  {!sidebarOpen && (
    <div className="flex h-full items-start p-2">
      <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  )}
</div>

      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
