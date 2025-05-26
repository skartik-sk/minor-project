"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, BookOpen, FileText, ArrowUpRight, Github, ArrowRight, Mail, Phone, Circle, UserRound } from "lucide-react";

interface Member {
  email: string;
  enrollment: string;
  name: string;
  phone: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  teamMembers: Member[];
  batch: string;
  category: string;
  deployedLink: string;
  githubLink: string;
  hardwareRequirements: string[];
  softwareRequirements: string[];
  supervisor: string;
  technologies: string[];
  type: string;
  userId: string;
}

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const displayValue = (value: string | undefined | null, suffix: string = "") => {
    return value ? `${value}${suffix}` : "N/A";
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id || typeof id !== "string") throw new Error("Invalid project ID");
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        else console.error("No such project!");
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{displayValue(project.title)}</h1>
        {/* {project.status && <Badge className={getStatusColor(project.status)}>{project.status}</Badge>} */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          {/* <TabsTrigger value="milestones">Milestones</TabsTrigger> */}
          {/* <TabsTrigger value="updates">Updates</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{displayValue(project.description)}</p>
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span>{displayValue(project.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{displayValue(project.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Batch:</span>
                    <span>{displayValue(project.batch)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Supervisor:</span>
                    <span>{displayValue(project.supervisor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Project Date:</span>
                    <span>{displayValue(project.date)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Team Size:</span>
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
                    <h4 className="font-medium">Hardware Requirements:</h4>
                    {project.hardwareRequirements?.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {project.hardwareRequirements.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">None specified.</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Software Requirements:</h4>
                    {project.softwareRequirements?.length > 0 ? (
                      <ul className="list-disc list-inside">
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
                    <Badge key={tech} variant="default" className="capitalize">{tech}</Badge>
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
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                {project.githubLink ? (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Github className="h-5 w-5" /> GitHub Repo
                  </a>
                ) : (
                  <span className="text-muted-foreground">GitHub link not provided.</span>
                )}
                {project.deployedLink ? (
                  <a
                    href={project.deployedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <ArrowUpRight className="h-5 w-5" /> Live Demo
                  </a>
                ) : (
                  <span className="text-muted-foreground">Live link not provided.</span>
                )}
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
                      <div className="font-medium">{displayValue(member.name)}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline"><UserRound/>{displayValue(member.enrollment)}</Badge>
                        <Badge variant="outline"><Mail/>{displayValue(member.email)}</Badge>
                        <Badge variant="outline"><Phone/>{displayValue(member.phone)}</Badge>
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

        {/* <TabsContent value="milestones" className="mt-6">
          ...
        </TabsContent> */}

        {/* <TabsContent value="updates" className="mt-6">
          ...
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
