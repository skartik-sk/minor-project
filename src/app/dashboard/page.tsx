"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, ArrowRight } from "lucide-react"
import { db, auth } from "@/lib/utils"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { ModeToggle } from "@/components/toggle-theme"

interface Project {
  id: string;
  status: string;
  title: string;
  description: string;
  date: string;
  teamMembers: { name: string }[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "projects"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const userProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[];
          setProjects(userProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <div className="flex gap-2">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-dark">
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
          <ModeToggle/>
          </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col justify-between p-4 shadow-sm transition hover:shadow-md">
          <CardHeader className="p-0 mb-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Badge
                className={`capitalize px-2 py-0.5 text-xs font-medium ${
                  project.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : project.status === "In Progress"
                    ? "bg-blue-100 text-blue-800"
                    : project.status === "In Review"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {project.status}
              </Badge>
              <span>{project.date}</span>
            </div>
            <CardTitle className="mt-2 text-base font-semibold text-foreground">
              {project.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
        
          <CardContent className="p-0 mt-2 text-sm text-muted-foreground">
            {project.teamMembers?.length || 0} team members
          </CardContent>
        
          <CardFooter className="p-0 mt-4">
            <Button asChild variant="link" className="ml-auto text-primary text-sm p-0 hover:underline">
              <Link href={`/dashboard/projects/${project.id}`}>
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        ))}
      </div>
    </div>
  );
}
