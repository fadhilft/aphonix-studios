import { useState, useEffect } from "react";
import { Lock, Package, MessageSquare, Check, Clock, X, Truck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  product_name: string;
  product_price: number;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  { value: 'confirmed', label: 'Confirmed', icon: Check, color: 'text-blue-500' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-500' },
  { value: 'delivered', label: 'Delivered', icon: Package, color: 'text-green-500' },
  { value: 'cancelled', label: 'Cancelled', icon: X, color: 'text-red-500' },
];

const OrdersAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchContactMessages();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Error fetching orders", description: error.message, variant: "destructive" });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchContactMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Error fetching messages", description: error.message, variant: "destructive" });
    } else {
      setContactMessages(data || []);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({ title: "Order status updated", description: `Order marked as ${newStatus}` });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "fadhil637") {
      setIsAuthenticated(true);
      toast({ title: "Welcome!", description: "You've successfully logged in." });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    if (!statusOption) return <Clock className="text-muted-foreground" size={16} />;
    const Icon = statusOption.icon;
    return <Icon className={statusOption.color} size={16} />;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <img src={logo} alt="Aphonix Studios" className="h-16 w-16 mx-auto mb-4 invert" />
            <h1 className="font-display text-2xl font-bold gradient-text">Orders Admin</h1>
            <p className="text-muted-foreground mt-2">Enter password to access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
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
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary text-primary-foreground font-display font-semibold rounded-lg box-glow hover:scale-[1.02] transition-transform"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-primary hover:underline text-sm">← Back to Website</a>
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
              <h1 className="font-display text-xl font-bold">Orders & Messages</h1>
              <p className="text-sm text-muted-foreground">Manage orders and contact messages</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-primary hover:underline text-sm">Products Admin</a>
            <a href="/" className="text-primary hover:underline text-sm">View Website</a>
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
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:bg-secondary'
            }`}
          >
            <Package size={20} />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all ${
              activeTab === 'messages'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:bg-secondary'
            }`}
          >
            <MessageSquare size={20} />
            Messages ({contactMessages.length})
          </button>
          <button
            onClick={() => { fetchOrders(); fetchContactMessages(); }}
            disabled={loading}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="font-medium">{order.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{order.email}</div>
                            {order.phone && <div className="text-muted-foreground">{order.phone}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.product_name}</TableCell>
                        <TableCell className="font-display font-bold text-primary">
                          ₹{order.product_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {order.address || '-'}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    <status.icon className={status.color} size={16} />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {contactMessages.length === 0 ? (
              <div className="bg-card border border-border rounded-xl text-center py-16">
                <MessageSquare className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No contact messages yet.</p>
              </div>
            ) : (
              contactMessages.map((message) => (
                <div key={message.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg">{message.name}</h3>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(message.created_at)}</span>
                  </div>
                  {message.subject && (
                    <p className="font-medium text-primary mb-2">Subject: {message.subject}</p>
                  )}
                  <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersAdmin;
