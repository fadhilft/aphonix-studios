import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, Save, X, Lock, ShoppingBag, Upload, Image, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ name: "", image: "", price: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [megaSaleEnabled, setMegaSaleEnabled] = useState(false);
  const [togglingMegaSale, setTogglingMegaSale] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchMegaSaleSetting();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      const saved = localStorage.getItem("aphonix-products");
      if (saved) setProducts(JSON.parse(saved));
    } else {
      setProducts(data.map(p => ({ id: p.id, name: p.name, image: p.image, price: Number(p.price), description: p.description || '' })));
    }
  };

  const fetchMegaSaleSetting = async () => {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'mega_sale_enabled')
      .maybeSingle();
    
    if (data) {
      setMegaSaleEnabled(data.value === 'true');
    }
  };

  const toggleMegaSale = async () => {
    setTogglingMegaSale(true);
    const newValue = !megaSaleEnabled;
    
    const { error } = await supabase
      .from('store_settings')
      .update({ value: newValue.toString() })
      .eq('key', 'mega_sale_enabled');

    if (error) {
      toast({ title: "Error updating mega sale setting", variant: "destructive" });
    } else {
      setMegaSaleEnabled(newValue);
      toast({ 
        title: newValue ? "🔥 MEGA SALE ACTIVATED!" : "Mega Sale Deactivated",
        description: newValue ? "Store is now in mega sale mode!" : "Store returned to normal mode"
      });
    }
    setTogglingMegaSale(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "fadhil637") {
      setIsAuthenticated(true);
      toast({ title: "Welcome back!", description: "You've successfully logged into the admin panel." });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" });
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { toast({ title: "Upload Failed", description: error.message, variant: "destructive" }); return null; }
    return supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) { setNewProduct({ ...newProduct, image: url }); toast({ title: "Image Uploaded" }); }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('products').insert({ name: newProduct.name, image: newProduct.image, price: parseFloat(newProduct.price), description: newProduct.description }).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setProducts([{ id: data.id, name: data.name, image: data.image, price: Number(data.price), description: data.description || '' }, ...products]);
    setNewProduct({ name: "", image: "", price: "", description: "" });
    setShowAddForm(false);
    toast({ title: "Product Added" });
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await supabase.from('products').update({ name: editingProduct.name, image: editingProduct.image, price: editingProduct.price, description: editingProduct.description }).eq('id', editingProduct.id);
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    toast({ title: "Product Updated" });
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "Product Deleted" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <img src={logo} alt="Aphonix Studios" className="h-16 w-16 mx-auto mb-4 invert" />
            <h1 className="font-display text-2xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Enter password to access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter admin password" />
            </div>
            <button type="submit" className="w-full px-6 py-4 bg-primary text-primary-foreground font-display font-semibold rounded-lg box-glow hover:scale-[1.02] transition-transform">Login</button>
          </form>
          <div className="mt-6 text-center"><a href="/" className="text-primary hover:underline text-sm">← Back to Website</a></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aphonix Studios" className="h-10 w-10 invert" />
            <div><h1 className="font-display text-xl font-bold">Admin Panel</h1><p className="text-sm text-muted-foreground">Manage your store products</p></div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-primary hover:underline text-sm">View Website</a>
            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm">Logout</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Mega Sale Toggle */}
        <div className={`mb-8 p-6 rounded-xl border-2 transition-all duration-500 ${megaSaleEnabled ? 'bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border-orange-500 animate-pulse' : 'bg-card border-border'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${megaSaleEnabled ? 'bg-orange-500 animate-bounce' : 'bg-secondary'}`}>
                <Zap size={24} className={megaSaleEnabled ? 'text-white' : 'text-muted-foreground'} />
              </div>
              <div>
                <h3 className={`font-display text-xl font-bold ${megaSaleEnabled ? 'text-orange-500' : 'text-foreground'}`}>
                  {megaSaleEnabled ? '🔥 MEGA SALE IS LIVE!' : 'Mega Sale Mode'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {megaSaleEnabled ? 'Your store is in mega sale mode with special effects!' : 'Activate to enable mega sale theme on the store'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleMegaSale}
              disabled={togglingMegaSale}
              className={`px-6 py-3 rounded-xl font-display font-bold transition-all duration-300 ${
                megaSaleEnabled 
                  ? 'bg-secondary text-foreground border border-border hover:bg-secondary/80' 
                  : 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white hover:scale-105 animate-shimmer'
              } disabled:opacity-50`}
            >
              {togglingMegaSale ? 'Updating...' : megaSaleEnabled ? 'Turn Off' : '🔥 Activate Mega Sale'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3"><ShoppingBag className="text-primary" size={28} /><h2 className="font-display text-2xl font-bold">Products ({products.length})</h2></div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform"><Plus size={20} />Add Product</button>
        </div>

        {showAddForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="font-display text-xl font-semibold mb-4">Add New Product</h3>
            <form onSubmit={addProduct} className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Product Name</label><input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter product name" /></div>
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50">
                  {uploading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>Uploading...</> : <><Upload size={20} />Upload Image</>}
                </button>
                {newProduct.image && <div className="mt-2 flex items-center gap-2"><img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-border" /><span className="text-sm text-green-500 flex items-center gap-1"><Image size={16} />Uploaded</span></div>}
              </div>
              <div><label className="block text-sm font-medium mb-2">Price (₹)</label><input type="number" required min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter price" /></div>
              <div><label className="block text-sm font-medium mb-2">Description</label><input type="text" required value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Brief description" /></div>
              <div className="md:col-span-2 flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" disabled={!newProduct.image} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform disabled:opacity-50">Add Product</button>
              </div>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl"><ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} /><p className="text-muted-foreground">No products yet. Add your first product!</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {editingProduct?.id === product.id ? (
                  <form onSubmit={updateProduct} className="p-4 space-y-4">
                    <input type="text" required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm" />
                    <input type="number" required min="0" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm" />
                    <input type="text" required value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm" />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-border rounded-lg hover:bg-secondary text-sm"><X size={16} />Cancel</button>
                      <button type="submit" className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm"><Save size={16} />Save</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="aspect-video bg-secondary"><img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/1a1a2e/00f0ff?text=No+Image'; }} /></div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-foreground mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <p className="text-xl font-display font-bold text-primary mb-4">₹{product.price.toLocaleString()}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProduct(product)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-border rounded-lg hover:bg-secondary text-sm"><Edit2 size={16} />Edit</button>
                        <button onClick={() => deleteProduct(product.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm"><Trash2 size={16} />Delete</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;