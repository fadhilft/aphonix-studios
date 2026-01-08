import { useState, useEffect } from "react";
import { X, ShoppingBag, Sparkles, Flame, Zap, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const WelcomeAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [megaSaleEnabled, setMegaSaleEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Fetch mega sale setting
      const { data } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'mega_sale_enabled')
        .maybeSingle();
      
      setMegaSaleEnabled(data?.value === 'true');

      const hasSeenAd = sessionStorage.getItem("aphonix_ad_seen");
      if (!hasSeenAd) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    };
    init();
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
        className={`absolute inset-0 backdrop-blur-sm animate-fade-in ${megaSaleEnabled ? 'bg-red-950/80' : 'bg-background/80'}`}
        onClick={handleClose}
      />
      
      {/* Ad Modal */}
      <div className={`relative w-full max-w-lg border rounded-3xl overflow-hidden animate-scale-in shadow-2xl ${
        megaSaleEnabled 
          ? 'bg-gradient-to-br from-red-950 via-card to-orange-950 border-orange-500' 
          : 'bg-card border-border'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            megaSaleEnabled ? 'bg-orange-500/80 hover:bg-orange-500' : 'bg-secondary/80 hover:bg-secondary'
          }`}
        >
          <X size={18} className="text-foreground" />
        </button>

        {/* Glow Effects */}
        {megaSaleEnabled ? (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 left-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
          </>
        )}
        
        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Animated Logo */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full animate-ping ${megaSaleEnabled ? 'bg-orange-500/20' : 'bg-primary/20'}`} style={{ animationDuration: '2s' }} />
            </div>
            <img
              src={logo}
              alt="Aphonix Studios"
              className="w-24 h-24 mx-auto relative z-10 animate-float"
            />
          </div>

          {/* Sparkles / Sale Banner */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {megaSaleEnabled ? (
              <>
                <Flame className="text-orange-500 animate-bounce" size={24} />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 font-bold text-lg uppercase tracking-wider animate-pulse">
                  🔥 MEGA SALE LIVE! 🔥
                </span>
                <Flame className="text-orange-500 animate-bounce" size={24} />
              </>
            ) : (
              <>
                <Sparkles className="text-primary animate-glow-pulse" size={20} />
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Special Offer</span>
                <Sparkles className="text-primary animate-glow-pulse" size={20} />
              </>
            )}
          </div>

          {/* Heading */}
          <h2 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${
            megaSaleEnabled 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' 
              : 'gradient-text'
          }`}>
            {megaSaleEnabled ? '🎉 MASSIVE DISCOUNTS!' : 'Welcome to Aphonix Studios!'}
          </h2>
          
          {/* Description */}
          <p className={`text-lg mb-6 max-w-sm mx-auto ${megaSaleEnabled ? 'text-orange-200' : 'text-muted-foreground'}`}>
            {megaSaleEnabled 
              ? 'Grab incredible deals before they\'re gone! Up to 70% OFF on premium products!'
              : 'Discover premium digital products, templates, and creative assets at our exclusive store.'
            }
          </p>

          {/* Sale Tags */}
          {megaSaleEnabled && (
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium flex items-center gap-1 border border-red-500/50">
                <Tag size={14} /> Hot Deals
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium flex items-center gap-1 border border-orange-500/50">
                <Zap size={14} /> Flash Sale
              </span>
            </div>
          )}

          {/* CTA Button */}
          <Button
            onClick={handleExploreStore}
            size="lg"
            className={`font-semibold px-8 py-6 text-lg rounded-xl group transition-all hover:scale-105 ${
              megaSaleEnabled 
                ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white hover:shadow-lg hover:shadow-orange-500/50' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {megaSaleEnabled ? (
              <>
                <Flame className="mr-2 group-hover:animate-bounce" size={24} />
                🔥 Shop the Sale!
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 group-hover:animate-bounce-subtle" size={24} />
                Explore Store
              </>
            )}
          </Button>

          {/* Skip text */}
          <p className={`text-sm mt-4 ${megaSaleEnabled ? 'text-orange-300/60' : 'text-muted-foreground'}`}>
            or press anywhere to continue browsing
          </p>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className={`absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent ${
            megaSaleEnabled ? 'via-orange-500/10' : 'via-primary/10'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeAd;
