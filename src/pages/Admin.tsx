import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Lock, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  useEffect(() => {
    const savedProducts = localStorage.getItem("aphonix-products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "fadhil637") {
      setIsAuthenticated(true);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged into the admin panel.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("aphonix-products", JSON.stringify(updatedProducts));
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      image: newProduct.image,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
    };
    
    saveProducts([...products, product]);
    setNewProduct({ name: "", image: "", price: "", description: "" });
    setShowAddForm(false);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added to the store.`,
    });
  };

  const updateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    
    saveProducts(updatedProducts);
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: "The product has been updated successfully.",
    });
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    saveProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the store.",
    });
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
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter admin password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary text-primary-foreground font-display font-semibold rounded-lg box-glow hover:scale-[1.02] transition-transform"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-primary hover:underline text-sm">
              ← Back to Website
            </a>
          </div>
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
            <div>
              <h1 className="font-display text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage your store products</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-primary hover:underline text-sm">
              View Website
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-primary" size={28} />
            <h2 className="font-display text-2xl font-bold">Products ({products.length})</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="font-display text-xl font-semibold mb-4">Add New Product</h3>
            <form onSubmit={addProduct} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter price in rupees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief product description"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {editingProduct?.id === product.id ? (
                  <form onSubmit={updateProduct} className="p-4 space-y-4">
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="url"
                      required
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="text"
                      required
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                      >
                        <Save size={16} />
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="aspect-video">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-foreground mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <p className="text-xl font-display font-bold text-primary mb-4">₹{product.price.toLocaleString()}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
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
