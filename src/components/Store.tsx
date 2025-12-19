import { useState, useEffect } from "react";
import { ShoppingBag, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const Store = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderForm, setOrderForm] = useState({ productId: "", name: "", email: "", phone: "", address: "" });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedProducts = localStorage.getItem("aphonix-products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Default demo products
      const demoProducts: Product[] = [
        {
          id: "1",
          name: "Premium Logo Design",
          image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
          price: 2999,
          description: "Custom logo design with unlimited revisions"
        },
        {
          id: "2",
          name: "Video Editing Package",
          image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400",
          price: 4999,
          description: "Professional video editing up to 10 minutes"
        },
        {
          id: "3",
          name: "Website Development",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
          price: 14999,
          description: "Complete responsive website with 5 pages"
        }
      ];
      setProducts(demoProducts);
      localStorage.setItem("aphonix-products", JSON.stringify(demoProducts));
    }
  }, []);

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    // Create mailto link for order
    const subject = encodeURIComponent(`New Order: ${selectedProduct.name}`);
    const body = encodeURIComponent(
      `New Order Details:\n\n` +
      `Product: ${selectedProduct.name}\n` +
      `Price: ₹${selectedProduct.price}\n\n` +
      `Customer Details:\n` +
      `Name: ${orderForm.name}\n` +
      `Email: ${orderForm.email}\n` +
      `Phone: ${orderForm.phone}\n` +
      `Address: ${orderForm.address}`
    );
    
    window.location.href = `mailto:aphonixstudios@gmail.com?subject=${subject}&body=${body}`;
    
    toast({
      title: "Order Submitted!",
      description: "Your order request has been sent. We'll contact you soon!",
    });
    
    setSelectedProduct(null);
    setOrderForm({ productId: "", name: "", email: "", phone: "", address: "" });
  };

  return (
    <section id="store" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <ShoppingBag className="text-primary" size={20} />
            <span className="text-primary font-medium">Aphonix Store</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Shop Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our service packages and place your order
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleOrder(product)}
                      className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:scale-105 transition-transform"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-display text-2xl font-bold mb-2">Place Order</h3>
              <p className="text-muted-foreground mb-6">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    required
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Send Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Store;
