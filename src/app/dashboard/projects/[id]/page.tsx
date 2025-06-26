"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { db } from "@/lib/utils"
import type { Project } from "@/types/project"
import { doc, getDoc } from "firebase/firestore"
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  FileText,
  Github,
  Mail,
  Phone,
  UserRound,
  Users,
  AlertCircle,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProjectDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const displayValue = (value: string | undefined | null, suffix = "") => {
    return value ? `${value}${suffix}` : "N/A"
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setError(null)
        if (!id || typeof id !== "string") {
          throw new Error("Invalid project ID")
        }

        const docRef = doc(db, "projects", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project)
        } else {
          throw new Error("Project not found")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        setError(error instanceof Error ? error.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Project Details</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Project Details</h1>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{displayValue(project.title)}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{displayValue(project.description)}</p>
            </CardContent>
          </Card>

          {/* Core Details and Requirements */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Category:</span>
                    <span>{displayValue(project.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Type:</span>
                    <span>{displayValue(project.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Batch:</span>
                    <span>{`${Number(displayValue(project.batch))-4}-${displayValue(project.batch)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Supervisor:</span>
                    <span>{displayValue(project.supervisor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Project Date:</span>
                    <span>{displayValue(project.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Team Size:</span>
                    <span>{project.teamMembers?.length || 0} members</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Hardware Requirements:</h4>
                    {project.hardwareRequirements?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {project.hardwareRequirements.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">None specified.</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Software Requirements:</h4>
                    {project.softwareRequirements?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {project.softwareRequirements.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">None specified.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              {project.technologies?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="capitalize">
                      {tech}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No technologies listed.</p>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Project Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  {project.githubLink ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        GitHub Repo
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">GitHub link not provided</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {project.deployedLink ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.deployedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Live demo not available</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {project.projectFileUrl ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.projectFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Project File
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Project file not provided</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>{project.teamMembers?.length || 0} members working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              {project.teamMembers?.length > 0 ? (
                <div className="divide-y">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="font-medium text-lg mb-2">{displayValue(member.name)}</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <UserRound className="h-3 w-3" />
                          {displayValue(member.enrollment)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {displayValue(member.email)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {displayValue(member.phone)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No team members assigned.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
