"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { db, auth } from "@/lib/utils"
import { collection, getDocs } from "firebase/firestore"
import { signOut } from "firebase/auth"
import * as XLSX from "xlsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, LogOut, ArrowLeft, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/project"

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"))
        const fetchedProjects = querySnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Project[]
        setProjects(fetchedProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    
    const projectYear = project.date ? new Date(project.date).getFullYear().toString() : ""
    const matchesYear = yearFilter === "all" || projectYear === yearFilter

    return matchesSearch && matchesCategory && matchesYear
  })

  const displayValue = (value: string | undefined | null, fallback: string = "N/A") => {
    return value || fallback
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "software":
        return "bg-blue-500 hover:bg-blue-600"
      case "hardware":
        return "bg-green-500 hover:bg-green-600"
      case "ai":
        return "bg-purple-500 hover:bg-purple-600"
      case "web":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "mobile":
        return "bg-red-500 hover:bg-red-600"
      case "other":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getAvailableYears = () => {
    const years = projects
      .map(project => project.date ? new Date(project.date).getFullYear().toString() : "")
      .filter(year => year !== "")
    return [...new Set(years)].sort().reverse()
  }

  const exportToExcel = () => {
    // Prepare data
    const formatted = filteredProjects.map(proj => ({
      Title: displayValue(proj.title),
      Description: displayValue(proj.description),
      Category: displayValue(proj.category),
      Supervisor: displayValue(proj.supervisor),
      Date: displayValue(proj.date),
      Type: displayValue(proj.type),
      Batch: displayValue(proj.batch),
      GitHub_Link: displayValue(proj.githubLink),
      Deployed_Link: displayValue(proj.deployedLink),
      Progress_Report: displayValue(proj.projectFileUrl),
      Technologies: proj.technologies?.join(', ') || 'None',
      Software_Requirements: proj.softwareRequirements?.join(', ') || 'None',
      Hardware_Requirements: proj.hardwareRequirements?.join(', ') || 'None',
      Team_Members: proj.teamMembers?.map(m => `${m.name} (${m.email})`).join('; ') || 'No members',
    }))

    // Create sheet and workbook
    const ws = XLSX.utils.json_to_sheet(formatted)
    const wb = XLSX.utils.book_new()

    // Style header row
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })]
      if (cell && !cell.s) cell.s = {}
      cell.s = {
        font: { bold: true, color: { rgb: 'FFFFFFFF' } },
        fill: { fgColor: { rgb: 'FF4472C4' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      }
    }

    // Set column widths
    const colWidths = Object.keys(formatted[0] || {}).map(key => ({ wch: Math.min(30, key.length + 5) }))
    ws['!cols'] = colWidths

    // Freeze header
    ws['!freeze'] = { xSplit: 0, ySplit: 1 }

    XLSX.utils.book_append_sheet(wb, ws, 'Projects')
    XLSX.writeFile(wb, `projects_${new Date().toISOString().slice(0,10)}.xlsx`)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            {filteredProjects.length} projects
          </Badge>
          <Button onClick={exportToExcel} className="bg-accent text-accent-foreground hover:bg-accent-dark">
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
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

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {getAvailableYears().map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
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
                    <div className="flex-1">
                      <h3 className="font-medium">{displayValue(project.title)}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {displayValue(project.description)}
                      </p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge className={`${getCategoryColor(project.category || "")} text-white capitalize`}>
                          {displayValue(project.category)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {displayValue(project.type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {displayValue(project.date)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Team: {project.teamMembers?.length || 0}
                        </span>
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
                        <h3 className="text-lg font-medium">{displayValue(project.title)}</h3>
                        <Badge className={`mt-2 ${getCategoryColor(project.category || "")} text-white capitalize`}>
                          {displayValue(project.category)}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <p className="mt-1 text-sm">{displayValue(project.description)}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                          <p className="mt-1 text-sm">{displayValue(project.category)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                          <p className="mt-1 text-sm">{displayValue(project.type)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                          <p className="mt-1 text-sm">{displayValue(project.date)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Batch</h4>
                          <p className="mt-1 text-sm">{displayValue(project.batch)}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Supervisor</h4>
                        <p className="mt-1 text-sm">{displayValue(project.supervisor)}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Team Members</h4>
                        <p className="mt-1 text-sm">{project.teamMembers?.length || 0} members</p>
                        {project.teamMembers && project.teamMembers.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {project.teamMembers.slice(0, 3).map((member, idx) => (
                              <div key={idx} className="text-xs text-muted-foreground">
                                {displayValue(member.name)} ({displayValue(member.email)})
                              </div>
                            ))}
                            {project.teamMembers.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{project.teamMembers.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Technologies</h4>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.technologies?.slice(0, 4).map((tech, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {(project.technologies?.length || 0) > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(project.technologies?.length || 0) - 4}
                            </Badge>
                          )}
                        </div>
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