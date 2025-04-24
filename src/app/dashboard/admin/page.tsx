"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, Clock, AlertCircle, FileCheck } from "lucide-react"

// Sample project data
const allProjects = [
  {
    id: 1,
    title: "AI-Powered Attendance System",
    department: "Computer Science",
    supervisor: "Dr. Smith",
    status: "In Progress",
    date: "Apr 2, 2024",
    team: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"],
  },
  {
    id: 2,
    title: "Smart Irrigation Controller",
    department: "Agricultural Engineering",
    supervisor: "Prof. Johnson",
    status: "Completed",
    date: "Mar 15, 2024",
    team: ["Robert Brown", "Emily Davis", "Michael Wilson"],
  },
  {
    id: 3,
    title: "AR Campus Tour Guide",
    department: "Computer Science",
    supervisor: "Dr. Williams",
    status: "In Review",
    date: "Apr 1, 2024",
    team: ["David Miller", "Lisa Anderson", "James Taylor", "Jennifer Thomas", "Richard Martin"],
  },
  {
    id: 4,
    title: "Blockchain-based Certificate Verification",
    department: "Information Technology",
    supervisor: "Prof. Davis",
    status: "Approved",
    date: "Mar 28, 2024",
    team: ["Thomas White", "Susan Harris"],
  },
  {
    id: 5,
    title: "Smart Parking System",
    department: "Electrical Engineering",
    supervisor: "Dr. Brown",
    status: "In Progress",
    date: "Mar 20, 2024",
    team: ["Daniel Clark", "Patricia Lewis", "Mark Robinson"],
  },
  {
    id: 6,
    title: "Virtual Lab Simulator",
    department: "Physics",
    supervisor: "Prof. Wilson",
    status: "Completed",
    date: "Feb 15, 2024",
    team: ["Charles Walker", "Nancy Allen", "Joseph Young", "Karen Scott"],
  },
  {
    id: 7,
    title: "Student Mental Health App",
    department: "Psychology",
    supervisor: "Dr. Taylor",
    status: "In Review",
    date: "Mar 25, 2024",
    team: ["Donald King", "Elizabeth Wright", "George Adams"],
  },
  {
    id: 8,
    title: "Automated Essay Grading System",
    department: "Computer Science",
    supervisor: "Prof. Anderson",
    status: "Approved",
    date: "Mar 10, 2024",
    team: ["Paul Baker", "Linda Nelson", "Steven Carter", "Barbara Mitchell"],
  },
]

// Statistics
const statistics = {
  total: allProjects.length,
  inProgress: allProjects.filter((p) => p.status === "In Progress").length,
  completed: allProjects.filter((p) => p.status === "Completed").length,
  inReview: allProjects.filter((p) => p.status === "In Review").length,
  approved: allProjects.filter((p) => p.status === "Approved").length,
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter projects based on search term, filters, and active tab
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || project.department === departmentFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "inProgress" && project.status === "In Progress") ||
      (activeTab === "completed" && project.status === "Completed") ||
      (activeTab === "inReview" && project.status === "In Review") ||
      (activeTab === "approved" && project.status === "Approved")

    return matchesSearch && matchesStatus && matchesDepartment && matchesTab
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
        return "bg-accent"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "In Review":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "Approved":
        return <FileCheck className="h-5 w-5 text-purple" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.inReview}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="inReview">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
      </Tabs>

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

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Psychology">Psychology</SelectItem>
              <SelectItem value="Agricultural Engineering">Agricultural Engineering</SelectItem>
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
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{getStatusIcon(project.status)}</div>
                    <div className="flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{project.department}</span>
                        <span>•</span>
                        <span>{project.supervisor}</span>
                        <span>•</span>
                        <span>{project.date}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <span className="text-xs text-muted-foreground">{project.team.length} team members</span>
                      </div>
                    </div>
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
                        <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
                        <p className="mt-1">{project.department}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Supervisor</h4>
                        <p className="mt-1">{project.supervisor}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                        <p className="mt-1">{project.date}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Team Members</h4>
                        <div className="mt-1 space-y-1">
                          {project.team.map((member, index) => (
                            <p key={index}>{member}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-accent hover:bg-accent-dark">Approve</Button>
                        <Button className="flex-1" variant="outline">
                          Review
                        </Button>
                      </div>
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

