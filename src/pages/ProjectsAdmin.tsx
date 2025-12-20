import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  videoUrl?: string;
  externalUrl?: string;
  rupees?: string;
}

const ProjectsAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "",
    image: "",
    description: "",
    videoUrl: "",
    externalUrl: "",
    rupees: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedProjects = localStorage.getItem("aphonix_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "fadhil637") {
      setIsAuthenticated(true);
      toast({ title: "Welcome to Projects Admin Panel!" });
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem("aphonix_projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.category || !newProject.image) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title!,
      category: newProject.category!,
      image: newProject.image!,
      description: newProject.description || "",
      videoUrl: newProject.videoUrl || "",
      externalUrl: newProject.externalUrl || "",
      rupees: newProject.rupees || ""
    };
    const updatedProjects = [...projects, project];
    saveProjects(updatedProjects);
    setNewProject({ title: "", category: "", image: "", description: "", videoUrl: "", externalUrl: "", rupees: "" });
    setShowAddForm(false);
    toast({ title: "Project added successfully!" });
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: string) => {
    const updatedProjects = projects.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    saveProjects(updatedProjects);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    saveProjects(updatedProjects);
    toast({ title: "Project deleted" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
                <Lock className="text-primary" size={32} />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">Projects Admin</h1>
              <p className="text-muted-foreground mt-2">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Login
              </Button>
            </form>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full mt-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} className="mr-2" /> Back
            </Button>
            <h1 className="font-display text-xl font-bold gradient-text">Projects Admin</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus size={20} className="mr-2" /> Add Project
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Form */}
        {showAddForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Add New Project</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X size={20} />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Title *"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-secondary border-border"
              />
              <Input
                placeholder="Category *"
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="bg-secondary border-border"
              />
              <div className="space-y-2">
                <Input
                  placeholder="Image URL *"
                  value={newProject.image}
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Use direct image links from Imgur, Unsplash, or Google Drive
                </p>
                {newProject.image && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <img 
                      src={newProject.image} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-lg bg-secondary border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/1a1a2e/ff0000?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>
              <Input
                placeholder="Rupees"
                value={newProject.rupees}
                onChange={(e) => setNewProject({ ...newProject, rupees: e.target.value })}
                className="bg-secondary border-border"
              />
              <Input
                placeholder="Video URL (YouTube embed)"
                value={newProject.videoUrl}
                onChange={(e) => setNewProject({ ...newProject, videoUrl: e.target.value })}
                className="bg-secondary border-border"
              />
              <Input
                placeholder="External URL"
                value={newProject.externalUrl}
                onChange={(e) => setNewProject({ ...newProject, externalUrl: e.target.value })}
                className="bg-secondary border-border"
              />
              <Textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-secondary border-border md:col-span-2"
              />
            </div>
            <Button onClick={handleAddProject} className="mt-4 bg-primary hover:bg-primary/90">
              <Save size={16} className="mr-2" /> Save Project
            </Button>
          </div>
        )}

        {/* Projects List */}
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl p-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-secondary"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/1a1a2e/00f0ff?text=No+Image';
                  }}
                />
                <div className="flex-1 min-w-0">
                  {editingId === project.id ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={project.title}
                        onChange={(e) => handleUpdateProject(project.id, "title", e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="Title"
                      />
                      <Input
                        value={project.category}
                        onChange={(e) => handleUpdateProject(project.id, "category", e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="Category"
                      />
                      <Input
                        value={project.image}
                        onChange={(e) => handleUpdateProject(project.id, "image", e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="Image URL"
                      />
                      <Input
                        value={project.rupees || ""}
                        onChange={(e) => handleUpdateProject(project.id, "rupees", e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="Rupees"
                      />
                      <Input
                        value={project.videoUrl || ""}
                        onChange={(e) => handleUpdateProject(project.id, "videoUrl", e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="Video URL"
                      />
                      <Input
                        value={project.externalUrl || ""}
                        onChange={(e) => handleUpdateProject(project.id, "externalUrl", e.target.value)}
                        className="bg-secondary border-border text-sm"
                        placeholder="External URL"
                      />
                      <Textarea
                        value={project.description}
                        onChange={(e) => handleUpdateProject(project.id, "description", e.target.value)}
                        className="bg-secondary border-border text-sm col-span-2"
                        placeholder="Description"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display font-semibold text-foreground truncate">{project.title}</h3>
                      <p className="text-primary text-sm">{project.category}</p>
                      <p className="text-muted-foreground text-sm truncate">{project.description}</p>
                      {project.rupees && <p className="text-primary font-semibold text-sm">₹{project.rupees}</p>}
                    </>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(editingId === project.id ? null : project.id)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {editingId === project.id ? <Save size={18} /> : <Edit2 size={18} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects yet. Add your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsAdmin;
