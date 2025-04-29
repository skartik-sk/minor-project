import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ArrowRight } from "lucide-react"
import { db } from "@/lib/utils"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth } from "@/lib/utils" // Corrected import for auth

interface Project {
  id: string;
  status: string;
  title: string;
  description: string;
  date: string;
  members: { name: string }[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]); // Properly typed state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, "projects"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(userProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-dark">
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
                      : "bg-accent text-accent-foreground"
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
              <div className="text-sm text-muted-foreground">{project.members.length} team members</div>
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

