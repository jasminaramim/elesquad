import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Star, Plus, LogOut, Loader2, Trash2, Mail, FileText, ExternalLink } from 'lucide-react';
import { Card, Button, SectionHeading } from '../../components/UI';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { id: 'projects', label: 'Projects', icon: LayoutDashboard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'documents', label: 'Sheets', icon: FileText },
  { id: 'messages', label: 'Messages', icon: Mail },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="flex flex-col md:row justify-between items-start md:items-center mb-16 gap-6">
        <SectionHeading title="Admin Dashboard" subtitle="Control Center" />
        <Button onClick={handleLogout} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
          <LogOut size={18} className="mr-2" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-display font-semibold ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 md:p-12" tiltEnabled={false}>
                {activeTab === 'projects' && <ProjectForm />}
                {activeTab === 'team' && <TeamForm />}
                {activeTab === 'reviews' && <ReviewForm />}
                {activeTab === 'documents' && <DocumentForm />}
                {activeTab === 'messages' && <MessagesList />}
              </Card>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ProjectForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [data, setData] = useState({
    title: '', description: '', image: '', techStack: '', liveLink: '',
    orderId: '', clientName: '', profileName: '', sheetLink: '', value: '', totalValue: '', projectType: 'solo'
  });

  const fetchList = async () => {
    const res = await axios.get('/api/projects');
    setList(res.data);
  };

  React.useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/projects', {
        ...data,
        techStack: data.techStack.split(',').map(s => s.trim()),
        userId: user?.id,
        developerName: user?.name || 'Admin'
      });
      toast.success('Project added successfully!');
      setData({ 
        title: '', description: '', image: '', techStack: '', liveLink: '',
        orderId: '', clientName: '', profileName: '', sheetLink: '', value: '', totalValue: '', projectType: 'solo'
      });
      fetchList();
    } catch (err) {
      toast.error('Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success('Project deleted');
      fetchList();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-bold mb-8">Add New Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input label="Project Title" value={data.title} onChange={v => setData({ ...data, title: v })} placeholder="e.g. Nexus Dashboard" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Type</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-white"
              value={data.projectType}
              onChange={e => setData({ ...data, projectType: e.target.value })}
            >
              <option value="solo" className="bg-bg">Solo</option>
              <option value="combine" className="bg-bg">Combine</option>
              <option value="leader" className="bg-bg">Leader</option>
              <option value="squad" className="bg-bg">Squad</option>
            </select>
          </div>
          <Input label="Order ID" value={data.orderId} onChange={v => setData({ ...data, orderId: v })} placeholder="ORD-123" />
          <Input label="Client Name" value={data.clientName} onChange={v => setData({ ...data, clientName: v })} placeholder="John Doe" />
          <Input label="Profile Name" value={data.profileName} onChange={v => setData({ ...data, profileName: v })} placeholder="Fiverr / Upwork" />
          <Input label="Project Value ($)" value={data.value} onChange={v => setData({ ...data, value: v })} placeholder="500" />
          <Input label="Total Value ($)" value={data.totalValue} onChange={v => setData({ ...data, totalValue: v })} placeholder="1000" />
          <Input label="Tech Stack (comma separated)" value={data.techStack} onChange={v => setData({ ...data, techStack: v })} placeholder="React, Node, MongoDB" />
          <div className="md:col-span-2 lg:col-span-3">
             <Input label="Sheet / Document Link" value={data.sheetLink} onChange={v => setData({ ...data, sheetLink: v })} placeholder="https://docs.google.com/..." />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Input label="Image URL" value={data.image} onChange={v => setData({ ...data, image: v })} placeholder="https://..." />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Input label="Live Link" value={data.liveLink} onChange={v => setData({ ...data, liveLink: v })} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Description</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none resize-none h-32"
            value={data.description}
            onChange={e => setData({ ...data, description: e.target.value })}
            placeholder="Describe the project masterpiece..."
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">Create Project</Button>
      </form>

      <div className="space-y-4 pt-12 border-t border-white/5">
        <h3 className="text-xl font-bold mb-6">Master Project List ({list.length})</h3>
        <div className="grid grid-cols-1 gap-4">
          {list.map(item => (
            <div key={item._id} className="flex items-center justify-between p-6 glass rounded-2xl group cursor-pointer hover:border-primary/30 transition-all" onClick={() => setSelectedProject(item)}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10"><LayoutDashboard size={24} /></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                      {item.projectType || 'Solo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                    <span>ID: {item.orderId || 'N/A'}</span>
                    <span>•</span>
                    <span className="text-primary">${item.value || '0'}</span>
                    <span>•</span>
                    <span className="text-white/60">Dev: {item.developerName || 'Member'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                {item.liveLink && (
                  <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 text-white/20 hover:text-primary transition-all">
                    <ExternalLink size={18} />
                  </a>
                )}
                <button onClick={() => handleDelete(item._id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-8 border-white/10 shadow-2xl relative">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
                
                <h2 className="text-3xl font-display font-bold mb-6">{selectedProject.title}</h2>
                
                <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                  <div>
                    <h5 className="text-xs font-mono uppercase text-white/20 mb-2">Project Details</h5>
                    <p><span className="text-white/40">Type:</span> {selectedProject.projectType}</p>
                    <p><span className="text-white/40">Value:</span> ${selectedProject.value}</p>
                    <p><span className="text-white/40">Total Value:</span> ${selectedProject.totalValue}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase text-white/20 mb-2">Client Info</h5>
                    <p><span className="text-white/40">Client:</span> {selectedProject.clientName}</p>
                    <p><span className="text-white/40">Order ID:</span> {selectedProject.orderId}</p>
                    <p><span className="text-white/40">Profile:</span> {selectedProject.profileName}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h5 className="text-xs font-mono uppercase text-white/20 mb-3">Description</h5>
                  <p className="text-white/60 leading-relaxed italic">"{selectedProject.description}"</p>
                </div>

                <div className="mb-8">
                  <h5 className="text-xs font-mono uppercase text-white/20 mb-3">Tech Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack?.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-primary border border-white/5">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                  {selectedProject.sheetLink && (
                    <a href={selectedProject.sheetLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="text-xs py-2">View Document</Button>
                    </a>
                  )}
                  {selectedProject.liveLink && (
                    <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer">
                      <Button className="text-xs py-2">Live Preview</Button>
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamForm() {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [data, setData] = useState({
    email: '', password: 'password123', name: '', memberId: '', designation: '', team: '', phone: '', role: 'Member'
  });

  const fetchList = async () => {
    const res = await axios.get('/api/admin/users');
    setList(res.data);
  };

  React.useEffect(() => { fetchList(); }, []);

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'Leader' ? 'Member' : 'Leader';
    try {
      await axios.patch(`/api/admin/users/${id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchList();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleVerifyToggle = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${id}/verify`, { isVerified: !currentStatus });
      toast.success(currentStatus ? 'Unverified' : 'Verified');
      fetchList();
    } catch (err) {
      toast.error('Verification update failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', data);
      toast.success('Member added successfully!');
      setData({ email: '', password: 'password123', name: '', memberId: '', designation: '', team: '', phone: '', role: 'Member' });
      fetchList();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === currentUser?.email) {
      toast.error("You cannot delete your own admin account!");
      return;
    }
    if (!confirm('Are you sure? This will permanently remove the member.')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('Member removed');
      fetchList();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-bold mb-8">Add New Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={data.name} onChange={v => setData({ ...data, name: v })} placeholder="John Doe" />
          <Input label="Email Address" type="email" value={data.email} onChange={v => setData({ ...data, email: v })} placeholder="member@elesquad.com" />
          <Input label="Member ID" value={data.memberId} onChange={v => setData({ ...data, memberId: v })} placeholder="ES-001" />
          <Input label="Designation" value={data.designation} onChange={v => setData({ ...data, designation: v })} placeholder="Lead Developer" />
          <Input label="Team Name" value={data.team} onChange={v => setData({ ...data, team: v })} placeholder="Alpha" />
          <Input label="Phone Number" value={data.phone} onChange={v => setData({ ...data, phone: v })} placeholder="+880..." />
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Initial Role</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-white"
              value={data.role}
              onChange={e => setData({ ...data, role: e.target.value })}
            >
              <option value="Member" className="bg-bg">Member</option>
              <option value="Leader" className="bg-bg">Leader (Admin)</option>
            </select>
          </div>
          <Input label="Default Password" type="text" value={data.password} onChange={v => setData({ ...data, password: v })} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Register Member'}
        </Button>
      </form>

      <div className="space-y-4 pt-12 border-t border-white/5">
        <h3 className="text-xl font-bold mb-6">EleSquad Members ({list.length})</h3>
        <div className="grid grid-cols-1 gap-4">
          {list.map(item => (
            <div key={item._id} className="flex flex-col md:flex-row md:items-center justify-between p-6 glass rounded-2xl group hover:border-primary/30 transition-all gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center font-bold text-primary relative">
                  {item.name?.[0] || 'U'}
                  {item.isVerified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                      <Star size={8} fill="currentColor" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    {item.name}
                    {item.role === 'Leader' && <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">Leader</span>}
                  </h4>
                  <p className="text-xs text-white/40">{item.email} • {item.designation || 'Squad Member'}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => handleVerifyToggle(item._id, item.isVerified)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${
                    item.isVerified ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {item.isVerified ? 'Verified' : 'Verify Member'}
                </button>
                
                <button 
                  onClick={() => handleRoleChange(item._id, item.role)}
                  className="px-3 py-1.5 bg-white/5 text-white/40 hover:bg-primary hover:text-white rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all"
                >
                  {item.role === 'Leader' ? 'Make Member' : 'Make Admin'}
                </button>

                <button 
                  onClick={() => handleDelete(item._id, item.email)} 
                  className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  disabled={item.email === currentUser?.email}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}

function TeamForm() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [data, setData] = useState({
    email: '', password: 'password123', name: '', memberId: '', designation: '', team: '', phone: '', role: 'Member'
  });

  const fetchList = async () => {
    const res = await axios.get('/api/admin/users');
    setList(res.data);
  };

  React.useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', data);
      toast.success('Member added successfully!');
      setData({ email: '', password: 'password123', name: '', memberId: '', designation: '', team: '', phone: '', role: 'Member' });
      fetchList();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will permanently remove the member.')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('Member removed');
      fetchList();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-bold mb-8">Add New Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={data.name} onChange={v => setData({ ...data, name: v })} placeholder="John Doe" />
          <Input label="Email Address" type="email" value={data.email} onChange={v => setData({ ...data, email: v })} placeholder="member@elesquad.com" />
          <Input label="Member ID" value={data.memberId} onChange={v => setData({ ...data, memberId: v })} placeholder="ES-001" />
          <Input label="Designation" value={data.designation} onChange={v => setData({ ...data, designation: v })} placeholder="Lead Developer" />
          <Input label="Team Name" value={data.team} onChange={v => setData({ ...data, team: v })} placeholder="Alpha" />
          <Input label="Phone Number" value={data.phone} onChange={v => setData({ ...data, phone: v })} placeholder="+880..." />
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Role</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all text-white"
              value={data.role}
              onChange={e => setData({ ...data, role: e.target.value })}
            >
              <option value="Member" className="bg-bg">Member</option>
              <option value="Leader" className="bg-bg">Leader (Admin)</option>
            </select>
          </div>
          <Input label="Default Password" type="text" value={data.password} onChange={v => setData({ ...data, password: v })} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Register Member'}
        </Button>
      </form>

      <div className="space-y-4 pt-12 border-t border-white/5">
        <h3 className="text-xl font-bold mb-6">EleSquad Members ({list.length})</h3>
        <div className="grid grid-cols-1 gap-4">
          {list.map(item => (
            <div key={item._id} className="flex items-center justify-between p-6 glass rounded-2xl group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center font-bold text-primary">
                  {item.name?.[0] || 'U'}
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    {item.name}
                    {item.role === 'Leader' && <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">Leader</span>}
                  </h4>
                  <p className="text-xs text-white/40">{item.email} • {item.designation || 'Squad Member'}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item._id)} 
                className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                disabled={item.email === 'thenaimrana@gmail.com'}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [data, setData] = useState({ title: '', clientName: '', orderId: '', feedback: '', rating: 5 });

  const fetchList = async () => {
    const res = await axios.get('/api/reviews');
    setList(res.data);
  };

  React.useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/reviews', {
        ...data,
        userId: user?.id,
        developerName: user?.name || 'Admin'
      });
      toast.success('Review added!');
      setData({ title: '', clientName: '', orderId: '', feedback: '', rating: 5 });
      fetchList();
    } catch (err) {
      toast.error('Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/reviews/${id}`);
      toast.success('Review removed');
      fetchList();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-bold mb-8">Add Client Testimonial</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Review Title" value={data.title} onChange={v => setData({ ...data, title: v })} placeholder="e.g. Amazing Experience" />
          <Input label="Client Name" value={data.clientName} onChange={v => setData({ ...data, clientName: v })} placeholder="Jane Doe" />
          <Input label="Order ID" value={data.orderId} onChange={v => setData({ ...data, orderId: v })} placeholder="ORD-445" />
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-2">Rating (1-5)</label>
            <input 
              type="number" min="1" max="5" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none text-white"
              value={data.rating}
              onChange={e => setData({ ...data, rating: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-2">Feedback</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 outline-none resize-none h-32"
            value={data.feedback}
            onChange={e => setData({ ...data, feedback: e.target.value })}
            required
            placeholder="What did the client say?"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">Create Review</Button>
      </form>

      <div className="space-y-4 pt-12 border-t border-white/5">
        <h3 className="text-xl font-bold mb-6">Testimonials</h3>
        {list.map(item => (
          <div key={item._id} className="flex items-center justify-between p-4 glass rounded-xl">
            <div>
              <h4 className="font-bold">{item.clientName}</h4>
              <p className="text-xs text-white/40 leading-relaxed line-clamp-1">{item.feedback}</p>
            </div>
            <button onClick={() => handleDelete(item._id)} className="text-white/20 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);

  const fetchList = async () => {
    const res = await axios.get(`/api/documents`);
    setList(res.data);
  };

  React.useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/documents/${id}`);
      toast.success('Sheet deleted');
      fetchList();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold">Team Sheets & Documents</h3>
        <Link to="/editor/new">
          <Button className="py-2 px-6 text-sm flex items-center gap-2">
             <Plus size={16} /> New Sheet
          </Button>
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-center py-20 text-white/20 italic">No documents found. Start collaborating!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(doc => (
            <div key={doc._id} className="p-6 glass rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
              <Link to={`/editor/${doc._id}`} className="flex items-center gap-4 flex-grow">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">{doc.title}</h4>
                  <p className="text-[10px] uppercase text-white/40 font-mono">Last Update: {new Date(doc.updatedAt).toLocaleDateString()}</p>
                </div>
              </Link>
              <button onClick={() => handleDelete(doc._id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const res = await axios.get('/api/contact');
      setList(res.data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/contact/${id}`);
      toast.success('Message deleted');
      fetchList();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-8">Client Messages</h3>
      {loading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : list.length === 0 ? (
        <p className="text-center text-white/40 py-12">No messages yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {list.map(msg => (
            <div key={msg._id} className="p-6 glass rounded-2xl relative group">
              <button 
                onClick={() => handleDelete(msg._id)}
                className="absolute top-6 right-6 text-white/20 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="mb-4">
                <h4 className="text-lg font-bold">{msg.name}</h4>
                <p className="text-sm text-primary font-mono">{msg.email}</p>
                <p className="text-[10px] text-white/20 uppercase mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-white/60 leading-relaxed bg-white/5 p-4 rounded-xl">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder = '', type = 'text' }: { label: string, value: any, onChange: (v: string) => void, placeholder?: string, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">{label}</label>
      <input 
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all"
      />
    </div>
  );
}
