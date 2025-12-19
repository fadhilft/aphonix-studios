import { User, Target, Zap } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            About Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pioneering digital solutions with a passion for innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
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
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-3xl font-display font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-3xl font-display font-bold text-primary mb-1">30+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-3xl font-display font-bold text-primary mb-1">2+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User size={36} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-foreground">Fadhil FT</h4>
                <p className="text-primary font-medium">Founder & CEO</p>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              "At Aphonix Studios, we don't just create digital content — we craft experiences 
              that resonate. Every project is an opportunity to push creative boundaries and 
              deliver excellence."
            </p>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target size={16} className="text-primary" />
                <span>Visionary Leader</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
