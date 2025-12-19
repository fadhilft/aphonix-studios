import { ExternalLink, Play } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    description: "Modern shopping experience with seamless checkout flow"
  },
  {
    title: "Brand Identity Video",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600",
    description: "Cinematic brand story for tech startup"
  },
  {
    title: "Music Festival Poster",
    category: "Poster Making",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
    description: "Vibrant poster design for live music event"
  },
  {
    title: "Restaurant Website",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    description: "Elegant online presence for fine dining"
  },
  {
    title: "Product Launch Video",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600",
    description: "High-impact reveal video for new product line"
  },
  {
    title: "Tech Conference Banner",
    category: "Poster Making",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    description: "Dynamic banner design for developer conference"
  }
];

const Projects = () => {
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
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our portfolio of creative works and digital solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
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
                  <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play size={20} className="text-primary-foreground ml-1" />
                  </button>
                  <button className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform border border-border">
                    <ExternalLink size={20} className="text-foreground" />
                  </button>
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
    </section>
  );
};

export default Projects;
