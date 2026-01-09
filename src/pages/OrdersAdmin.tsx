import { useState, useEffect } from "react";
import { Lock, Package, MessageSquare, Check, Clock, X, Truck, RefreshCw, Send, Reply } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface OrderReply {
  id: string;
  order_id: string;
  message: string;
  sent_at: string;
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
  const [orderReplies, setOrderReplies] = useState<OrderReply[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders');
  const [loading, setLoading] = useState(false);
  const [replyModal, setReplyModal] = useState<{ open: boolean; order: Order | null; type: 'order' | 'message'; message?: ContactMessage }>({ open: false, order: null, type: 'order' });
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchContactMessages();
      fetchOrderReplies();
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

  const fetchOrderReplies = async () => {
    const { data, error } = await supabase
      .from('order_replies')
      .select('*')
      .order('sent_at', { ascending: false });
    
    if (!error && data) {
      setOrderReplies(data);
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

  const handleReply = (order: Order) => {
    setReplyModal({ open: true, order, type: 'order' });
    setReplyMessage("");
  };

  const handleReplyToMessage = (message: ContactMessage) => {
    setReplyModal({ open: true, order: null, type: 'message', message });
    setReplyMessage("");
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) return;
    
    setSendingReply(true);
    try {
      const recipientEmail = replyModal.type === 'order' ? replyModal.order?.email : replyModal.message?.email;
      const recipientName = replyModal.type === 'order' ? replyModal.order?.name : replyModal.message?.name;
      const subject = replyModal.type === 'order' 
        ? `Order Update: ${replyModal.order?.product_name}` 
        : `Re: ${replyModal.message?.subject || 'Your Inquiry'}`;

      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'reply',
          email: recipientEmail,
          name: recipientName,
          subject,
          message: replyMessage,
          orderId: replyModal.order?.id,
        }
      });

      if (error) throw error;

      // Save reply to database if it's an order reply
      if (replyModal.type === 'order' && replyModal.order) {
        await supabase.from('order_replies').insert({
          order_id: replyModal.order.id,
          message: replyMessage,
        });
        fetchOrderReplies();
      }

      toast({ title: "Reply Sent!", description: `Email sent to ${recipientEmail}` });
      setReplyModal({ open: false, order: null, type: 'order' });
      setReplyMessage("");
    } catch (error: any) {
      console.error('Reply error:', error);
      toast({ title: "Failed to send reply", description: error.message, variant: "destructive" });
    } finally {
      setSendingReply(false);
    }
  };

  const getOrderReplies = (orderId: string) => {
    return orderReplies.filter(r => r.order_id === orderId);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="bg-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-8">
            <img src={logo} alt="Aphonix Studios" className="h-16 w-16 mx-auto mb-4 invert" />
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Orders Admin</h1>
            <p className="text-muted-foreground mt-2">Enter password to access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-display font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-purple-400 hover:underline text-sm">← Back to Website</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/30 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aphonix Studios" className="h-10 w-10 invert" />
            <div>
              <h1 className="font-display text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Orders & Messages</h1>
              <p className="text-sm text-purple-300/60">Manage orders and contact messages</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-purple-400 hover:underline text-sm">Products Admin</a>
            <a href="/" className="text-purple-400 hover:underline text-sm">View Website</a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-800/50 border border-purple-500/30 hover:bg-purple-500/10'
            }`}
          >
            <Package size={20} />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold transition-all ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-800/50 border border-purple-500/30 hover:bg-purple-500/10'
            }`}
          >
            <MessageSquare size={20} />
            Messages ({contactMessages.length})
          </button>
          <button
            onClick={() => { fetchOrders(); fetchContactMessages(); fetchOrderReplies(); }}
            disabled={loading}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto text-purple-400/50 mb-4" size={48} />
                <p className="text-purple-300/60">No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                      <TableHead className="text-purple-300">Date</TableHead>
                      <TableHead className="text-purple-300">Customer</TableHead>
                      <TableHead className="text-purple-300">Contact</TableHead>
                      <TableHead className="text-purple-300">Product</TableHead>
                      <TableHead className="text-purple-300">Price</TableHead>
                      <TableHead className="text-purple-300">Address</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                      <TableHead className="text-purple-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-purple-500/20 hover:bg-purple-500/5">
                        <TableCell className="text-sm text-purple-300/60 whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="font-medium">{order.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{order.email}</div>
                            {order.phone && <div className="text-purple-300/60">{order.phone}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.product_name}</TableCell>
                        <TableCell className="font-display font-bold text-purple-400">
                          ₹{order.product_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-purple-300/60">
                          {order.address || '-'}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px] bg-slate-800/50 border-purple-500/30">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-purple-500/30">
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
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleReply(order)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors"
                            >
                              <Reply size={14} />
                              Reply
                            </button>
                            {getOrderReplies(order.id).length > 0 && (
                              <span className="text-xs text-purple-400/60">
                                {getOrderReplies(order.id).length} replies sent
                              </span>
                            )}
                          </div>
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
              <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl text-center py-16">
                <MessageSquare className="mx-auto text-purple-400/50 mb-4" size={48} />
                <p className="text-purple-300/60">No contact messages yet.</p>
              </div>
            ) : (
              contactMessages.map((message) => (
                <div key={message.id} className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg">{message.name}</h3>
                      <p className="text-sm text-purple-300/60">{message.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-purple-300/60">{formatDate(message.created_at)}</span>
                      <button
                        onClick={() => handleReplyToMessage(message)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors"
                      >
                        <Reply size={14} />
                        Reply
                      </button>
                    </div>
                  </div>
                  {message.subject && (
                    <p className="font-medium text-purple-400 mb-2">Subject: {message.subject}</p>
                  )}
                  <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Reply Modal */}
      <Dialog open={replyModal.open} onOpenChange={(open) => setReplyModal({ ...replyModal, open })}>
        <DialogContent className="bg-slate-900 border-purple-500/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Send Reply
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
              <p className="text-sm text-purple-300/60">To:</p>
              <p className="font-medium">
                {replyModal.type === 'order' ? replyModal.order?.name : replyModal.message?.name} 
                <span className="text-purple-400 ml-2">
                  ({replyModal.type === 'order' ? replyModal.order?.email : replyModal.message?.email})
                </span>
              </p>
              {replyModal.type === 'order' && replyModal.order && (
                <p className="text-sm text-purple-300/60 mt-1">
                  Order: {replyModal.order.product_name} - ₹{replyModal.order.product_price.toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-300">Your Message</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Type your reply message..."
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setReplyModal({ open: false, order: null, type: 'order' })}
                className="flex-1 px-4 py-3 border border-purple-500/30 rounded-lg font-medium hover:bg-purple-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={sendingReply || !replyMessage.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
              >
                {sendingReply ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersAdmin;
