import { useState, useEffect } from "react";
import { X, ShoppingBag, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const WelcomeAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenAd = sessionStorage.getItem("aphonix_ad_seen");
    if (!hasSeenAd) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("aphonix_ad_seen", "true");
  };

  const handleExploreStore = () => {
    setIsVisible(false);
    sessionStorage.setItem("aphonix_ad_seen", "true");
    navigate("/store");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Ad Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden animate-scale-in shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-secondary/80 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X size={18} className="text-foreground" />
        </button>

        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Animated Logo */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            <img
              src={logo}
              alt="Aphonix Studios"
              className="w-24 h-24 mx-auto relative z-10 animate-float"
            />
          </div>

          {/* Sparkles */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-primary animate-glow-pulse" size={20} />
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Special Offer</span>
            <Sparkles className="text-primary animate-glow-pulse" size={20} />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Welcome to Aphonix Studios!
          </h2>
          
          {/* Description */}
          <p className="text-muted-foreground text-lg mb-6 max-w-sm mx-auto">
            Discover premium digital products, templates, and creative assets at our exclusive store.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleExploreStore}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl group transition-all hover:scale-105"
          >
            <ShoppingBag className="mr-2 group-hover:animate-bounce-subtle" size={24} />
            Explore Store
          </Button>

          {/* Skip text */}
          <p className="text-muted-foreground text-sm mt-4">
            or press anywhere to continue browsing
          </p>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeAd;
