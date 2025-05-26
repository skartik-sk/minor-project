"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { db, auth } from "@/lib/utils";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";

// File Upload Components
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file";
import * as React from "react";

interface TeamMember {
  name: string;
  enrollment: string;
  email: string;
  phone: string;
}

export default function CreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Project Details
  const [category, setCategory] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [batch, setBatch] = useState<string>("");

  // Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentMemberName, setCurrentMemberName] = useState("");
  const [currentMemberEnrollment, setCurrentMemberEnrollment] = useState("");
  const [currentMemberEmail, setCurrentMemberEmail] = useState("");
  const [currentMemberPhone, setCurrentMemberPhone] = useState("");

  // Project Links
  const [githubLink, setGithubLink] = useState<string>("");
  const [deployedLink, setDeployedLink] = useState<string>("");

  // Technologies
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [currentTechnology, setCurrentTechnology] = useState<string>("");

  // Requirements
  const [hardwareRequirements, setHardwareRequirements] = useState<string[]>([]);
  const [currentHardwareReq, setCurrentHardwareReq] = useState<string>("");
  const [softwareRequirements, setSoftwareRequirements] = useState<string[]>([]);
  const [currentSoftwareReq, setCurrentSoftwareReq] = useState<string>("");

  // File Upload State
  const [projectFile, setProjectFile] = useState<File[]>([]); // To store the uploaded PDF file

  // --- File Upload Validation ---
  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      // Validate file type (only PDF)
      if (file.type !== "application/pdf") {
        return "Only PDF files are allowed.";
      }

      // Validate file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB.`;
      }

      // Only allow one file
      if (projectFile.length >= 1) {
        return "You can only upload one file.";
      }

      return null;
    },
    [projectFile],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" was rejected.`,
    });
  }, []);

  // --- Helper Functions ---

  const handleAddMember = () => {
    if (
      currentMemberName.trim() &&
      currentMemberEnrollment.trim() &&
      currentMemberEmail.trim() &&
      currentMemberPhone.trim()
    ) {
      if (!/\S+@\S+\.\S+/.test(currentMemberEmail.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
      setTeamMembers([
        ...teamMembers,
        {
          name: currentMemberName.trim(),
          enrollment: currentMemberEnrollment.trim(),
          email: currentMemberEmail.trim(),
          phone: currentMemberPhone.trim(),
        },
      ]);
      setCurrentMemberName("");
      setCurrentMemberEnrollment("");
      setCurrentMemberEmail("");
      setCurrentMemberPhone("");
    } else {
      toast.error(
        "Please fill in all fields (Name, Email, Enrollment, Phone) to add a team member."
      );
    }
  };

  const handleAddMemberOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleAddGenericTag = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[]
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
    setValue("");
  };

  const handleRemoveGenericTag = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic form validation for required fields
    const form = e.currentTarget;
    const title = (form.querySelector("#title") as HTMLInputElement)?.value;
    const description = (form.querySelector("#description") as HTMLTextAreaElement)?.value;
    const supervisor = (form.querySelector("#supervisor") as HTMLInputElement)?.value;

    if (!title || !description || !category || !supervisor || !batch || !projectType || teamMembers.length === 0 || hardwareRequirements.length === 0 || softwareRequirements.length === 0) {
      toast.error("Please fill in all required fields and add at least one team member, hardware, and software requirement.");
      setIsLoading(false);
      return;
    }

    // Validation for file upload
    if (projectFile.length === 0) {
      toast.error("Please upload a project file (PDF).");
      setIsLoading(false);
      return;
    }

    let fileDownloadURL: string | null = null;
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to create a project.");
        router.push("/login");
        setIsLoading(false);
        return;
      }

      // --- File Upload to Cloudinary via API Route ---
      const fileToUpload = projectFile[0];
      const formData = new FormData();
      formData.append('file', fileToUpload);

      // const uploadResponse = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });


      // console.log(uploadResponse)
      // if (!uploadResponse.ok) {
      //   const errorData = await uploadResponse.json();
      //   throw new Error(errorData.error || 'Failed to upload file.');
      // }

      // const uploadResult = await uploadResponse.json();
      // fileDownloadURL = uploadResult.url;
      // toast.success("File uploaded to Cloudinary!");


      // --- Save Project Data to Firestore ---
      await addDoc(collection(db, "projects"), {
        title,
        description,
        category,
        supervisor,
        batch,
        teamMembers,
        githubLink: githubLink.trim() || null,
        deployedLink: deployedLink.trim() || null,
        technologies,
        hardwareRequirements,
        softwareRequirements,
        type: projectType,
        userId: user.uid,
        status: "Pending Review",
        date: new Date().toLocaleDateString('en-GB'),
        createdAt: new Date().toISOString(),
        // projectFileUrl: fileDownloadURL, 
      });

      toast.success("Project created successfully!");
      router.push("/dashboard");
    } catch (err: any) { // Catching as 'any' for simpler error handling
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-8 px-4">
      <h1 className="mb-6 text-2xl font-semibold text-center">Create New Project</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pb-4">
            {/* Basic Info */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Project Title *</Label>
              <Input id="title" placeholder="Enter a descriptive title" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Project Description *</Label>
              <Textarea id="description" placeholder="Describe your project" className="min-h-32" required />
            </div>

            {/* Grid Sections */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="supervisor" className="text-sm font-medium">Supervisor *</Label>
                <Input id="supervisor" placeholder="Supervisor Name" required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="batchStartYear" className="text-sm font-medium">Batch *</Label>
                <Input id="batchStartYear" type="number" placeholder="e.g. 2020" value={batch} onChange={e => setBatch(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type" className="text-sm font-medium">Project Type *</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="type"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Links & Tags */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="githubLink" className="text-sm font-medium">GitHub Repository (Optional)</Label>
                <Input id="githubLink" type="url" placeholder="https://github.com/..." value={githubLink} onChange={e => setGithubLink(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deployedLink" className="text-sm font-medium">Deployed Link (Optional)</Label>
                <Input id="deployedLink" type="url" placeholder="https://..." value={deployedLink} onChange={e => setDeployedLink(e.target.value)} />
              </div>
            </div>


            {(['technologies', 'hardwareRequirements', 'softwareRequirements'] as const).map((type) => {
              const titleMap = {
                technologies: 'Technologies Used',
                hardwareRequirements: 'Hardware Requirements *',
                softwareRequirements: 'Software Requirements *'
              };
              const placeholderMap = {
                technologies: 'Add technology and press Enter',
                hardwareRequirements: 'Add hardware item and press Enter',
                softwareRequirements: 'Add software item and press Enter'
              };
              const list = type === 'technologies' ? technologies : type === 'hardwareRequirements' ? hardwareRequirements : softwareRequirements;
              const current = type === 'technologies' ? currentTechnology : type === 'hardwareRequirements' ? currentHardwareReq : currentSoftwareReq;
              const setCurrent = type === 'technologies' ? setCurrentTechnology : type === 'hardwareRequirements' ? setCurrentHardwareReq : setCurrentSoftwareReq;
              const setList = type === 'technologies' ? setTechnologies : type === 'hardwareRequirements' ? setHardwareRequirements : setSoftwareRequirements;

              return (
                <div key={type} className="flex flex-col gap-2">
                  <Label htmlFor={`${type}Input`} className="text-sm font-medium">{titleMap[type]}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`${type}Input"`} placeholder={placeholderMap[type]} value={current} onChange={e => setCurrent(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter') { e.preventDefault(); handleAddGenericTag(current, setCurrent, setList, list); }
                      }}
                    />
                    <Button type="button" size="sm" onClick={() => handleAddGenericTag(current, setCurrent, setList, list)}>Add</Button>
                  </div>
                  {list.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {list.map((item, i) => (
                        <div key={i} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm flex items-center shadow-sm">
                          {item}
                          <button type="button" onClick={() => handleRemoveGenericTag(i, setList)} className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground hover:hover:bg-secondary-foreground/10 rounded-full p-0.5">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="space-y-4">
              <h3 className="text-md font-medium">Team Members *</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentMemberName" className="text-sm font-medium">Name *</Label>
                  <Input id="currentMemberName" placeholder="Full Name" value={currentMemberName} onChange={e => setCurrentMemberName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentMemberEmail" className="text-sm font-medium">Email *</Label>
                  <Input id="currentMemberEmail" type="email" placeholder="Email Address" value={currentMemberEmail} onChange={e => setCurrentMemberEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentMemberEnrollment" className="text-sm font-medium">Enrollment *</Label>
                  <Input id="currentMemberEnrollment" placeholder="Enrollment No." value={currentMemberEnrollment} onChange={e => setCurrentMemberEnrollment(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentMemberPhone" className="text-sm font-medium">Phone *</Label>
                  <Input id="currentMemberPhone" type="tel" placeholder="Phone Number" value={currentMemberPhone} onChange={e => setCurrentMemberPhone(e.target.value)} onKeyDown={handleAddMemberOnEnter} />
                </div>
              </div>
              <Button type="button" size="sm" onClick={handleAddMember}>Add Member</Button>
              {teamMembers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {teamMembers.map((m, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-xs flex items-center shadow-sm">
                      {`${m.name} | ${m.enrollment} | ${m.email} | ${m.phone}`}
                      <button type="button" onClick={() => handleRemoveTeamMember(i)} className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-foreground/10 rounded-full p-0.5">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="projectFile" className="text-sm font-medium">Upload Project File (PDF) *</Label>
              <FileUpload
                value={projectFile}
                onValueChange={setProjectFile}
                onFileValidate={onFileValidate}
                onFileReject={onFileReject}
                accept="application/pdf"
                maxFiles={1}
                className="w-full"
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">Drag & drop your PDF file here</p>
                    <p className="text-muted-foreground text-xs">
                      Or click to browse (max 1 PDF, up to 10MB)
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse file
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {projectFile.map((file) => (
                    <FileUploadItem key={file.name} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}