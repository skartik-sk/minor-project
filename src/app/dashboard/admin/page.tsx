"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { db } from "@/lib/utils"
import { collection, getDocs } from "firebase/firestore"

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

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]); // Properly typed state
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"))
        const fetchedProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[]
        setProjects(fetchedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(searchTerm.toLowerCase())

    // Removed status filter as it's not part of the Project interface
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Removed getStatusColor since there is no status property
const getCategoryColor = (category: string) => {
  switch (category) {
    case "software":
      return "bg-blue-500 hover:bg-blue-600";
    case "hardware":
      return "bg-green-500 hover:bg-green-600";
    case "ai":
      return "bg-purple-500 hover:bg-purple-600";
    case "web":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "mobile":
      return "bg-red-500 hover:bg-red-600";
    case "other":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Projects</h1>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {/* Removed Status Filter */}

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="software">Software Development</SelectItem>
              <SelectItem value="hardware">Hardware & IoT</SelectItem>
              <SelectItem value="ai">AI & Machine Learning</SelectItem>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="mobile">Mobile App Development</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-6">
        <div className="w-full lg:w-2/3">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold">Projects List</h2>
              <span className="text-sm text-muted-foreground">{filteredProjects.length} projects</span>
            </div>
            <div className="divide-y">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${selectedProject === project.id ? "bg-muted" : ""
                    }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {/* Changed to category badge */}
                        <Badge className={`${getCategoryColor(project.category)} capitalize`}>{project.category}</Badge>
                        <span className="text-xs text-muted-foreground">{project.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2 shrink-0" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No projects found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 w-full lg:mt-0 lg:w-1/3">
          {selectedProject ? (
            <div className="rounded-lg border bg-card">
              <div className="border-b p-4">
                <h2 className="text-xl font-semibold">Project Details</h2>
              </div>
              <div className="p-4">
                {(() => {
                  const project = projects.find((p) => p.id === selectedProject)
                  if (!project) return null

                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        {/* Changed to category badge */}
                        <Badge className={`mt-2 ${getCategoryColor(project.category)} capitalize`}>{project.category}</Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <p className="mt-1">{project.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                          <p className="mt-1">{project.category}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                          <p className="mt-1">{project.date}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Supervisor</h4>
                        <p className="mt-1">{project.supervisor}</p>
                      </div>

                      <Button className="w-full" variant="default" asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>View Full Details</Link>
                      </Button>
                    </div>
                  )
                })()}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">Select a project to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}