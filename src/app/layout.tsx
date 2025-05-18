"use client";
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] })

const metadata: Metadata = {
  title: "University Minor Projects",
  description: "Platform for university minor projects",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <html lang="en" className="" >
      <body className={inter.className} suppressHydrationWarning>
        {children} <Toaster />
      </body>
    </html>
  }

  return (
    <html lang="en" className="" >
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >{children} <Toaster />
        </ThemeProvider></body>
    </html>
  )
}
