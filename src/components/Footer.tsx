import logo from "@/assets/logo.png";
const Footer = () => {
  return <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aphonix Studios" className="h-8 w-8 invert" />
            <span className="font-display text-lg font-bold">APHONIX STUDIOS</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#store" className="hover:text-primary transition-colors">Store</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="text-sm text-muted-foreground">© 2025Aphonix Studios. All rights reserved.</div>
        </div>
      </div>
    </footer>;
};
export default Footer;