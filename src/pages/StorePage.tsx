import { useState, useEffect } from "react";
import { ShoppingBag, Send, Search, ArrowLeft, Zap, Flame, Tag, Sparkles, Clock, Percent, Gift, Star, Crown, Heart, ShoppingCart, LogOut, User, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderForm, setOrderForm] = useState({ productId: "", name: "", email: "", phone: "", address: "" });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [megaSaleEnabled, setMegaSaleEnabled] = useState<boolean | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { cartItems, addToCart, removeFromCart, isInCart, cartCount } = useCart();

  useEffect(() => {
    const init = async () => {
      await fetchMegaSaleSetting();
      fetchProducts();
    };
    init();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        description: p.description || ""
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMegaSaleSetting = async () => {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'mega_sale_enabled')
      .maybeSingle();
    
    setMegaSaleEnabled(data?.value === 'true');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase() === "admin") {
      navigate("/admin");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
    setOrderForm(prev => ({ ...prev, email: user?.email || "" }));
  };

  const handleAddToCart = async (product: Product) => {
    const success = await addToCart(product.id);
    if (success) {
      toast({
        title: "Added to Saved Items!",
        description: `${product.name} has been saved.`,
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This item is already in your saved list.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    const success = await removeFromCart(cartItemId);
    if (success) {
      toast({ title: "Removed", description: "Item removed from saved list." });
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    setSubmittingOrder(true);

    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'order',
          name: orderForm.name,
          email: orderForm.email,
          phone: orderForm.phone,
          address: orderForm.address,
          productName: selectedProduct.name,
          productPrice: selectedProduct.price,
        }
      });

      if (error) throw error;
      
      toast({
        title: "🎉 Order Submitted!",
        description: "Your order has been sent successfully. We'll contact you soon!",
      });
      
      setSelectedProduct(null);
      setOrderForm({ productId: "", name: "", email: "", phone: "", address: "" });
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error sending your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Show loading until mega sale setting is loaded
  if (megaSaleEnabled === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${megaSaleEnabled ? 'bg-gradient-to-b from-red-950 via-background to-orange-950' : 'bg-background'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
        {megaSaleEnabled ? (
          <>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🔥</div>
              <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>💥</div>
              <div className="absolute top-40 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>⚡</div>
              <div className="absolute bottom-40 right-1/4 text-5xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎉</div>
              <div className="absolute bottom-20 left-20 text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>💰</div>
            </div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
      </div>

      {/* Mega Sale Banner */}
      {megaSaleEnabled && (
        <>
          <div className="relative z-50 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 py-3 overflow-hidden">
            <div className="flex items-center justify-center gap-4 animate-pulse">
              <Flame className="text-white animate-bounce" size={24} />
              <span className="text-white font-display font-bold text-lg md:text-xl tracking-wider">
                🔥 MEGA SALE IS LIVE! UP TO 70% OFF! 🔥
              </span>
              <Flame className="text-white animate-bounce" size={24} />
            </div>
          </div>
          
          <div className="fixed bottom-4 left-4 z-40 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold animate-bounce shadow-lg shadow-orange-500/50">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Limited Time!</span>
            </div>
          </div>
          
          <div className="fixed bottom-4 right-20 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold animate-bounce shadow-lg shadow-yellow-500/50" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2">
              <Percent size={16} />
              <span>Huge Savings!</span>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${megaSaleEnabled ? 'bg-red-950/80 border-orange-500/50' : 'bg-background/80 border-border'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} className={megaSaleEnabled ? 'text-orange-500' : 'text-primary'} />
              <img src={logo} alt="Aphonix Studios" className="h-8 w-8 invert" />
              <span className={`font-display text-lg font-bold hidden sm:inline ${megaSaleEnabled ? 'text-orange-500 animate-pulse' : 'text-glow'}`}>
                {megaSaleEnabled ? '🔥 MEGA SALE STORE' : 'APHONIX STORE'}
              </span>
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 transition-all ${
                    megaSaleEnabled 
                      ? 'bg-red-900/50 border-orange-500/50 focus:ring-orange-500 focus:border-transparent' 
                      : 'bg-secondary/50 border-border focus:ring-primary focus:border-transparent'
                  }`}
                />
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Cart Button - only show for logged in users */}
              {user && (
                <button
                  onClick={() => setShowCart(true)}
                  className={`relative p-3 rounded-full transition-all ${megaSaleEnabled ? 'bg-orange-500/20 hover:bg-orange-500/30' : 'bg-secondary hover:bg-secondary/80'}`}
                >
                  <Heart size={20} className={megaSaleEnabled ? 'text-orange-500' : 'text-primary'} />
                  {cartCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${megaSaleEnabled ? 'bg-orange-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Info or Sign In */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{user.email?.split('@')[0]}</span>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    megaSaleEnabled 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${megaSaleEnabled ? 'bg-orange-500/20' : 'bg-primary/10'}`}>
            {megaSaleEnabled ? (
              <>
                <Zap className="text-orange-500 animate-bounce" size={20} />
                <span className="text-orange-500 font-medium">🔥 Mega Sale Live!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="text-primary animate-bounce" size={20} />
                <span className="text-primary font-medium">Aphonix Store</span>
              </>
            )}
          </div>
          <h1 className={`font-display text-4xl md:text-6xl font-bold mb-4 ${megaSaleEnabled ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse' : 'gradient-text'}`}>
            {megaSaleEnabled ? '🔥 MEGA SALE 🔥' : 'Shop Our Services'}
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${megaSaleEnabled ? 'text-orange-200' : 'text-muted-foreground'}`}>
            {megaSaleEnabled ? 'Grab incredible deals before they\'re gone! Limited time offers!' : 'Browse our service packages and place your order'}
          </p>
          
          {megaSaleEnabled && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/50 animate-pulse">
                <Tag className="text-red-500" size={16} />
                <span className="text-red-400 font-medium">Hot Deals</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/50 animate-pulse" style={{ animationDelay: '0.2s' }}>
                <Sparkles className="text-orange-500" size={16} />
                <span className="text-orange-400 font-medium">Limited Time</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/50 animate-pulse" style={{ animationDelay: '0.4s' }}>
                <Gift className="text-yellow-500" size={16} />
                <span className="text-yellow-400 font-medium">Free Gifts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/50 animate-pulse" style={{ animationDelay: '0.6s' }}>
                <Crown className="text-pink-500" size={16} />
                <span className="text-pink-400 font-medium">VIP Offers</span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No products found. Try a different search!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`rounded-xl overflow-hidden transition-all duration-500 group animate-fade-in ${
                  megaSaleEnabled 
                    ? 'bg-gradient-to-br from-red-900/50 via-card to-orange-900/50 border-2 border-orange-500/50 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/30' 
                    : 'bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video overflow-hidden relative bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/1a1a2e/00f0ff?text=No+Image';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${megaSaleEnabled ? 'from-red-900/80' : 'from-background/80'}`} />
                  
                  {/* Save Button - only show for logged in users */}
                  {user && (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`absolute top-3 left-3 p-2 rounded-full transition-all ${
                        isInCart(product.id)
                          ? 'bg-red-500 text-white'
                          : megaSaleEnabled
                            ? 'bg-orange-500/80 text-white hover:bg-orange-500'
                            : 'bg-primary/80 text-primary-foreground hover:bg-primary'
                      }`}
                    >
                      <Heart size={16} fill={isInCart(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                  
                  {/* Sale Badges */}
                  {megaSaleEnabled && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm animate-bounce">
                      🔥 SALE
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className={`font-display text-xl font-semibold mb-2 transition-colors ${megaSaleEnabled ? 'text-foreground group-hover:text-orange-400' : 'text-foreground group-hover:text-primary'}`}>
                    {product.name}
                  </h3>
                  <p className={`text-sm mb-4 ${megaSaleEnabled ? 'text-orange-200/70' : 'text-muted-foreground'}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-display font-bold ${megaSaleEnabled ? 'text-orange-500' : 'text-primary'}`}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleOrder(product)}
                      className={`px-4 py-2 font-medium rounded-lg hover:scale-105 transition-all duration-300 ${
                        megaSaleEnabled 
                          ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white hover:shadow-lg hover:shadow-orange-500/50' 
                          : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30'
                      }`}
                    >
                      {megaSaleEnabled ? '🔥 Grab Now!' : 'Order Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className={`relative w-full max-w-md h-full border-l overflow-y-auto animate-slide-in-right ${megaSaleEnabled ? 'bg-gradient-to-b from-red-950 via-card to-orange-950 border-orange-500/50' : 'bg-card border-border'}`}>
            <div className={`sticky top-0 z-10 p-4 border-b ${megaSaleEnabled ? 'bg-red-950/90 border-orange-500/50' : 'bg-card border-border'}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <Heart className={megaSaleEnabled ? 'text-orange-500' : 'text-primary'} size={24} />
                  Saved Items ({cartCount})
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-secondary rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">No saved items yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Click the heart on products to save them!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className={`rounded-xl p-4 ${megaSaleEnabled ? 'bg-red-900/30 border border-orange-500/30' : 'bg-secondary/50 border border-border'}`}>
                    <div className="flex gap-4">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/1a1a2e/00f0ff?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold">{item.product?.name}</h3>
                        <p className={`text-lg font-bold mt-1 ${megaSaleEnabled ? 'text-orange-500' : 'text-primary'}`}>
                          ₹{item.product?.price.toLocaleString()}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => item.product && handleOrder(item.product)}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg ${
                              megaSaleEnabled
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            Order
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className={`border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in ${megaSaleEnabled ? 'bg-gradient-to-br from-red-950 via-card to-orange-950 border-orange-500/50' : 'bg-card border-border'}`}>
            <h3 className="font-display text-2xl font-bold mb-2">
              {megaSaleEnabled && '🔥 '} Place Order
            </h3>
            <p className={`mb-6 ${megaSaleEnabled ? 'text-orange-200' : 'text-muted-foreground'}`}>
              {selectedProduct.name} - ₹{selectedProduct.price.toLocaleString()}
            </p>
            
            <form onSubmit={submitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    megaSaleEnabled 
                      ? 'bg-red-900/50 border-orange-500/50 focus:ring-orange-500' 
                      : 'bg-input border-border focus:ring-primary'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    megaSaleEnabled 
                      ? 'bg-red-900/50 border-orange-500/50 focus:ring-orange-500' 
                      : 'bg-input border-border focus:ring-primary'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    megaSaleEnabled 
                      ? 'bg-red-900/50 border-orange-500/50 focus:ring-orange-500' 
                      : 'bg-input border-border focus:ring-primary'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address (Optional)</label>
                <textarea
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                    megaSaleEnabled 
                      ? 'bg-red-900/50 border-orange-500/50 focus:ring-orange-500' 
                      : 'bg-input border-border focus:ring-primary'
                  }`}
                  placeholder="Enter your address"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className={`flex-1 px-4 py-3 font-medium rounded-lg transition-all disabled:opacity-50 ${
                    megaSaleEnabled 
                      ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white hover:shadow-lg' 
                      : 'bg-primary text-primary-foreground hover:shadow-lg'
                  }`}
                >
                  {submittingOrder ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StorePage;
