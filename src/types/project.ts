export interface Member {
  email: string
  enrollment: string
  name: string
  phone: string
}

export interface Project {
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
   projectFileUrl:string
}