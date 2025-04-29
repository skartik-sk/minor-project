"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, BookOpen, FileText, MessageSquare } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  category: string;
  supervisor: string;
  team: { name: string; email: string; role: string }[];
  technologies: string[];
  milestones: { title: string; date: string; status: string }[];
  updates: { date: string; content: string }[];
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id || typeof id !== "string") {
          throw new Error("Invalid project ID");
        }

        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          console.error("No such project!");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Not Started":
        return "bg-gray-500";
      default:
        return "bg-accent";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
      </div>

      <Tabs value="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Start Date:</span>
                    <span>{project.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">End Date:</span>
                    <span>{project.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span>{project.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span>{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Supervisor:</span>
                    <span>{project.supervisor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Team Size:</span>
                    <span>{project.team.length} members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
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
              <CardDescription>{project.team.length} members working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {project.team.map((member, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="font-medium">{member.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{member.email}</div>
                    <div className="mt-1">
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Milestones
              </CardTitle>
              <CardDescription>Track the progress of project milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{milestone.title}</h3>
                        <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">Due: {milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Project Updates
              </CardTitle>
              <CardDescription>Recent updates and progress reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.updates.map((update, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <div className="text-sm font-medium">{update.date}</div>
                    <p className="mt-1">{update.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}