"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, List, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Create Project", href: "/dashboard/create", icon: PlusCircle },
    { name: "All Projects", href: "/dashboard/projects", icon: List },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Mobile sidebar toggle */}
        <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center gap-2 border-b bg-background px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <span className="text-xl font-semibold">Minor Projects</span>
        </div>

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-30 transform bg-background transition duration-200 ease-in-out lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-xl font-semibold">Minor Projects</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="mt-4 px-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === item.href ? "bg-purple text-white" : "text-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <Sidebar className="hidden lg:flex">
          <SidebarHeader className="p-4">
            <h1 className="text-xl font-bold">Minor Projects</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                    <LogOut />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

