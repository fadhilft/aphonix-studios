import { ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden cyber-grid">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="animate-slide-up">
          <div className="inline-block mb-8 animate-float">
            <img 
              src={logo} 
              alt="Aphonix Studios Logo" 
              className="w-32 h-32 mx-auto invert drop-shadow-2xl"
            />
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text text-glow">APHONIX</span>
            <br />
            <span className="text-foreground">STUDIOS</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Where Technology Meets Creativity. Transforming ideas into digital masterpieces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-display font-semibold rounded-lg box-glow hover:scale-105 transition-transform duration-300"
            >
              Explore Services
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary font-display font-semibold rounded-lg hover:bg-primary/10 transition-colors duration-300"
            >
              Get In Touch
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-primary" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
