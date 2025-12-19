import { Target, Zap } from "lucide-react";
import ceoPhoto from "@/assets/ceo-photo.png";

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            About Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pioneering digital solutions with a passion for innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
              Building the Future, One Pixel at a Time
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              At Aphonix Studios, we blend cutting-edge technology with artistic vision to create 
              digital experiences that captivate and inspire. Our team of creative technologists 
              pushes the boundaries of what's possible in web design, video production, and 
              digital marketing.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded with a vision to democratize high-quality digital services, we've grown 
              into a full-service creative studio trusted by businesses and individuals alike.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 pt-6">
              {[
                { value: "50+", label: "Projects Completed" },
                { value: "30+", label: "Happy Clients" },
                { value: "2+", label: "Years Experience" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="text-3xl font-display font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden animate-fade-in hover:border-primary/30 transition-all duration-500 group" style={{ animationDelay: '400ms' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-primary transition-all duration-300 group-hover:scale-105">
                <img 
                  src={ceoPhoto} 
                  alt="Fadhil FT - CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Fadhil FT</h4>
                <p className="text-primary font-medium">Founder & CEO</p>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6 italic">
              "At Aphonix Studios, we don't just create digital content — we craft experiences 
              that resonate. Every project is an opportunity to push creative boundaries and 
              deliver excellence."
            </p>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Target size={16} className="text-primary" />
                <span>Visionary Leader</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Zap size={16} className="text-primary" />
                <span>Tech Enthusiast</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
