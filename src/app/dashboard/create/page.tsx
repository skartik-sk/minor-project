"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { db } from "@/lib/utils"
import { collection, addDoc } from "firebase/firestore"

export default function CreateProject() {
  const [isLoading, setIsLoading] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [teamMembers, setTeamMembers] = useState<{ name: string; enrollment: string; email: string }[]>([])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.currentTarget;
      const titleInput = form.querySelector("#title") as HTMLInputElement;
      const descriptionInput = form.querySelector("#description") as HTMLTextAreaElement;
      const categoryElement = form.querySelector("#category") as HTMLSelectElement;
      const supervisorInput = form.querySelector("#supervisor") as HTMLInputElement;
      const projectLinkInput = form.querySelector("#projectLink") as HTMLInputElement;
      const typeElement = form.querySelector("#type") as HTMLSelectElement;
      const year = new Date().getFullYear().toString();

      const projectData = {
        title: titleInput.value,
        description: descriptionInput.value,
        category: categoryElement.value,
        supervisor: supervisorInput.value,
        teamMembers,
        technologies,
        projectLink: projectLinkInput.value || null,
        type: typeElement.value,
        year,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "projects"), projectData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Create New Project</h1>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Fill in the information about your minor project</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" placeholder="Enter a descriptive title for your project" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project, its objectives, and expected outcomes"
                className="min-h-32"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software Development</SelectItem>
                    <SelectItem value="hardware">Hardware & IoT</SelectItem>
                    <SelectItem value="ai">AI & Machine Learning</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile App Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input id="supervisor" placeholder="Name of your project supervisor" required />
            </div>
              
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team">Team Members</Label>
              <div>
                <Input
                  id="teamMemberName"
                  placeholder="Enter team member name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const name = e.currentTarget.value.trim()
                      if (name) {
                        setTeamMembers([...teamMembers, { name, enrollment: '', email: '' }])
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm flex flex-col items-start">
                    <span>Name: {member.name}</span>
                    <Input
                      placeholder="Enter enrollment number"
                      value={member.enrollment}
                      onChange={(e) => {
                        const updatedMembers = [...teamMembers]
                        updatedMembers[index].enrollment = e.target.value
                        setTeamMembers(updatedMembers)
                      }}
                      className="mt-1"
                    />
                    <button
                      type="button"
                      onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}
                      className="mt-2 text-accent-foreground/50 hover:text-primary-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectLink">Project Link (Optional)</Label>
              <Input
                id="projectLink"
                placeholder="Enter a link to the project (e.g., GitHub, live demo)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies Used</Label>
              <Input
                id="technologies"
                placeholder="Add a technology and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const value = e.currentTarget.value.trim()
                    if (value && !technologies.includes(value)) {
                      setTechnologies([...technologies, value])
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm flex items-center">
                  {tech}
                  <button
                    type="button"
                    onClick={() => setTechnologies(technologies.filter((_, i) => i !== index))}
                    className="ml-2 text-primary-foreground/50 hover:text-primary-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent-foreground/50 hover:text-accent" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

