import { Globe, Video, Image, Palette, Code, Megaphone } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Design",
    description: "Modern, responsive websites that captivate visitors and drive conversions. From landing pages to full web applications.",
  },
  {
    icon: Video,
    title: "Video Editing",
    description: "Professional video editing services for YouTube, social media, promotional content, and cinematic productions.",
  },
  {
    icon: Image,
    title: "Poster Making",
    description: "Eye-catching posters and graphics for events, marketing campaigns, and brand promotion.",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Comprehensive graphic design services including logos, branding, and visual identity creation.",
  },
  {
    icon: Code,
    title: "App Development",
    description: "Custom web and mobile application development tailored to your business needs.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Strategic digital marketing solutions to boost your online presence and reach your target audience.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive digital solutions to elevate your brand
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="text-primary" size={28} />
              </div>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-display font-semibold rounded-lg box-glow hover:scale-105 transition-transform duration-300"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
