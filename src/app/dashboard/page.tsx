import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ArrowRight } from "lucide-react"

// Sample project data
const projects = [
  {
    id: 1,
    title: "AI-Powered Attendance System",
    description: "A facial recognition system for automated attendance tracking in classrooms",
    status: "In Progress",
    date: "Apr 2, 2024",
    members: 4,
  },
  {
    id: 2,
    title: "Smart Irrigation Controller",
    description: "IoT-based system for efficient water management in agriculture",
    status: "Completed",
    date: "Mar 15, 2024",
    members: 3,
  },
  {
    id: 3,
    title: "AR Campus Tour Guide",
    description: "Augmented reality application for interactive campus tours",
    status: "In Review",
    date: "Apr 1, 2024",
    members: 5,
  },
  {
    id: 4,
    title: "Blockchain-based Certificate Verification",
    description: "Secure system for verifying academic certificates using blockchain",
    status: "Approved",
    date: "Mar 28, 2024",
    members: 2,
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Button asChild className="bg-purple hover:bg-purple-dark">
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <Badge
                  className={`${
                    project.status === "Completed"
                      ? "bg-green-500"
                      : project.status === "In Progress"
                        ? "bg-blue-500"
                        : project.status === "In Review"
                          ? "bg-yellow-500"
                          : "bg-purple"
                  }`}
                >
                  {project.status}
                </Badge>
                <span className="text-sm text-muted-foreground">{project.date}</span>
              </div>
              <CardTitle className="mt-2">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{project.members} team members</div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <Button asChild variant="ghost" className="ml-auto flex items-center gap-1 p-0">
                <Link href={`/dashboard/projects/${project.id}`}>
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

