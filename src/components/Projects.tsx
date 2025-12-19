import { ExternalLink, Play, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    description: "Modern shopping experience with seamless checkout flow",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    externalUrl: "https://example.com"
  },
  {
    id: "2",
    title: "Brand Identity Video",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600",
    description: "Cinematic brand story for tech startup",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    externalUrl: "https://example.com"
  },
  {
    id: "3",
    title: "Music Festival Poster",
    category: "Poster Making",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
    description: "Vibrant poster design for live music event",
    externalUrl: "https://example.com"
  },
  {
    id: "4",
    title: "Restaurant Website",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    description: "Elegant online presence for fine dining",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    externalUrl: "https://example.com"
  },
  {
    id: "5",
    title: "Product Launch Video",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600",
    description: "High-impact reveal video for new product line",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    externalUrl: "https://example.com"
  },
  {
    id: "6",
    title: "Tech Conference Banner",
    category: "Poster Making",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    description: "Dynamic banner design for developer conference",
    externalUrl: "https://example.com"
  }
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProjects = localStorage.getItem("aphonix_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(defaultProjects);
      localStorage.setItem("aphonix_projects", JSON.stringify(defaultProjects));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().trim() === "admin") {
      navigate("/projects-admin");
    }
  };

  const handlePlayClick = (project: Project) => {
    if (project.videoUrl) {
      setSelectedProject(project);
      setShowVideo(true);
    }
  };

  const handleExternalClick = (project: Project) => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Our Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Explore our portfolio of creative works and digital solutions
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Icons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {project.videoUrl && (
                    <button 
                      onClick={() => handlePlayClick(project)}
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform animate-glow-pulse"
                    >
                      <Play size={20} className="text-primary-foreground ml-1" />
                    </button>
                  )}
                  {project.externalUrl && (
                    <button 
                      onClick={() => handleExternalClick(project)}
                      className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform border border-border"
                    >
                      <ExternalLink size={20} className="text-foreground" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                  {project.category}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
                {project.rupees && (
                  <p className="text-primary font-semibold mt-2">₹{project.rupees}</p>
                )}
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.1), transparent, hsl(var(--accent) / 0.1))'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            {selectedProject?.videoUrl && (
              <iframe
                src={selectedProject.videoUrl}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
