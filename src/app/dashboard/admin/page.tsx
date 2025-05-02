"use client"

import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/utils"
import { collection, getDocs } from "firebase/firestore"
import * as XLSX from "xlsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  team: string[];
  type?: string;
  year?: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState("2025"); // Default to current year
  const [typeFilter, setTypeFilter] = useState("all");
  // const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const fetchedProjects = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesYear = project.year === yearFilter;
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    return matchesYear && matchesType;
  });

  const exportToExcel = () => {
    const formattedProjects = filteredProjects.map((project) => ({
      Name: project.title || "N/A",
      Status: project.status || "N/A",
      Type: project.type || "N/A",
      Members: project.team ? project.team.join(", ") : "No members",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedProjects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "projects.xlsx");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-lg font-semibold text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Minor">Minor</SelectItem>
              <SelectItem value="Major">Major</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToExcel} className="bg-accent text-accent-foreground hover:bg-accent-dark">
          Export to Excel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.id} className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p>Status: {project.status}</p>
            <p>Type: {project.type}</p>
            <p>Year: {project.year}</p>
            <p>Members: {project.team ? project.team.join(", ") : "No members"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

