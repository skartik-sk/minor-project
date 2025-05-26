"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ArrowRight, ArrowUpRight, Loader2, Github } from "lucide-react"
import { db, auth } from "@/lib/utils"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { ModeToggle } from "@/components/toggle-theme"

interface Member {
  email: string
  enrollment: string
  name: string
  phone: string
}

interface Project {
  id: string
  title: string
  description: string
  date: string
  teamMembers: Member[]
  batch: string
  category: string
  createdAt: string
  deployedLink: string
  githubLink: string
  hardwareRequirements: string[]
  softwareRequirements: string[]
  supervisor: string
  technologies: string[]
  type: string
  userId: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "projects"), where("userId", "==", user.uid))
          const docs = await getDocs(q)
          const userProjects = docs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project))
          setProjects(userProjects)
        } catch (error) {
          console.error("Error fetching projects:", error)
        } finally {
          setLoading(false)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <div className="flex gap-2">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-dark">
            <Link href="/dashboard/create" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>

      {/* No Projects */}
      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
       <Card
  key={project.id}
  className="flex flex-col justify-between h-full p-4 rounded-2xl border shadow-sm transition-all hover:shadow-md"
>
  <CardHeader className="p-0 mb-4 space-y-2">
    {/* Header Top Row */}
    <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
      <div className="flex items-center flex-wrap gap-2">
        {project.type && <Badge variant="secondary" className="capitalize">{project.type}</Badge>}
        {project.category && <Badge variant="secondary" className="capitalize">{project.category}</Badge>}
      </div>
      <div className="flex items-center gap-2">
        {project.githubLink && (
          <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
        {project.deployedLink && (
          <a
          href={project.deployedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>

    {/* Title and Description */}
    <CardTitle className="text-base font-semibold text-foreground">
      {project.title}
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
      {project.description}
    </CardDescription>
  </CardHeader>

  {/* Team Info */}
  <CardContent className="p-0 mt-2 text-sm text-muted-foreground">
    {project.teamMembers?.length ?? 0} team member{project.teamMembers?.length === 1 ? '' : 's'}
  </CardContent>

  {/* Footer with CTA */}
  <CardFooter className="p-0 mt-4">
        <span>{project.batch}</span>
    <Button asChild variant="link" className="ml-auto text-sm p-0 text-primary hover:underline">
      <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-1">
        View Details
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  </CardFooter>
</Card>

          ))}
        </div>
      )}
    </div>
  )
}
