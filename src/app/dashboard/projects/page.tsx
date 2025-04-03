"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

// Sample project data
const allProjects = [
  {
    id: 1,
    title: "AI-Powered Attendance System",
    description: "A facial recognition system for automated attendance tracking in classrooms",
    status: "In Progress",
    date: "Apr 2, 2024",
    supervisor: "Dr. Smith",
    category: "AI & Machine Learning",
  },
  {
    id: 2,
    title: "Smart Irrigation Controller",
    description: "IoT-based system for efficient water management in agriculture",
    status: "Completed",
    date: "Mar 15, 2024",
    supervisor: "Prof. Johnson",
    category: "Hardware & IoT",
  },
  {
    id: 3,
    title: "AR Campus Tour Guide",
    description: "Augmented reality application for interactive campus tours",
    status: "In Review",
    date: "Apr 1, 2024",
    supervisor: "Dr. Williams",
    category: "Mobile App Development",
  },
  {
    id: 4,
    title: "Blockchain-based Certificate Verification",
    description: "Secure system for verifying academic certificates using blockchain",
    status: "Approved",
    date: "Mar 28, 2024",
    supervisor: "Prof. Davis",
    category: "Web Development",
  },
  {
    id: 5,
    title: "Smart Parking System",
    description: "IoT-based system for efficient parking management on campus",
    status: "In Progress",
    date: "Mar 20, 2024",
    supervisor: "Dr. Brown",
    category: "Hardware & IoT",
  },
  {
    id: 6,
    title: "Virtual Lab Simulator",
    description: "VR-based simulator for conducting virtual lab experiments",
    status: "Completed",
    date: "Feb 15, 2024",
    supervisor: "Prof. Wilson",
    category: "Software Development",
  },
  {
    id: 7,
    title: "Student Mental Health App",
    description: "Mobile app for monitoring and improving student mental health",
    status: "In Review",
    date: "Mar 25, 2024",
    supervisor: "Dr. Taylor",
    category: "Mobile App Development",
  },
  {
    id: 8,
    title: "Automated Essay Grading System",
    description: "NLP-based system for automated grading of student essays",
    status: "Approved",
    date: "Mar 10, 2024",
    supervisor: "Prof. Anderson",
    category: "AI & Machine Learning",
  },
]

export default function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // Filter projects based on search term and filters
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "In Review":
        return "bg-yellow-500"
      case "Approved":
        return "bg-purple"
      default:
        return "bg-gray-500"
    }
  }

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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Software Development">Software Development</SelectItem>
              <SelectItem value="Hardware & IoT">Hardware & IoT</SelectItem>
              <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
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
                  className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                    selectedProject === project.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
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
                  const project = allProjects.find((p) => p.id === selectedProject)
                  if (!project) return null

                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        <Badge className={`mt-2 ${getStatusColor(project.status)}`}>{project.status}</Badge>
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

                      <Button className="w-full bg-purple hover:bg-purple-dark" asChild>
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

