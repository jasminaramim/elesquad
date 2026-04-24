import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Star, Plus, LogOut, Loader2, Trash2, Mail, FileText, ExternalLink, MessageCircle, User, Save, Rocket, ShieldCheck } from 'lucide-react';
import { Card, Button, SectionHeading } from '../../components/UI';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatHub from '../../components/ChatHub';

const tabs = [
  { id: 'projects', label: 'Projects', icon: LayoutDashboard },
  { id: 'services', label: 'Services', icon: Rocket },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'documents', label: 'Sheets', icon: FileText },
  { id: 'chat', label: 'Squad Chat', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-30">
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
                  activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'bg-surface text-foreground/40 hover:bg-surface/80 border border-border/50'
                } shadow-sm transition-all duration-300`}
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
                  {activeTab === 'services' && <ServiceForm />}
                  {activeTab === 'team' && <TeamForm />}
                  {activeTab === 'chat' && <ChatHub />}
                  {activeTab === 'reviews' && <ReviewForm />}
                  {activeTab === 'documents' && <DocumentForm />}
                  {activeTab === 'profile' && <AdminProfileTab />}
                </Card>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
    </div>
  );
}

function AdminProfileTab() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', memberId: '', designation: '', team: '', bio: '', image: '', phone: '', role: '' });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const uid = user?.id || (user as any)?._id;
    if (!uid) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/${uid}`);
      setProfile(prev => ({
        ...prev,
        ...res.data
      }));
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = user?.id || (user as any)?._id;
    if (!uid) {
      toast.error('Admin identity lost. Please re-login.');
      return;
    }
    try {
      console.log('AdminDashboard: Updating profile for UID', uid);
      await axios.put(`/api/admin/users/${uid}`, profile);
      
      // Update local context so Navbar reflects changes
      if (user) {
        login({ ...user, ...profile });
      }
      
      toast.success('Admin profile updated');
      await fetchProfile();
    } catch (err) {
      console.error('Admin update error:', err);
      toast.error('Update failed');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    
    const IMGBB_KEY = 'd0a7e8a0e9b16541d7071e4625452bd0';
    const readerForBase64 = new FileReader();
    readerForBase64.onloadend = async () => {
      const base64String = (readerForBase64.result as string).split(',')[1];
      const formDataImgBB = new FormData();
      formDataImgBB.append('image', base64String);

      try {
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, formDataImgBB);
        if (res.data.success) {
          setProfile(prev => ({ ...prev, image: res.data.data.url }));
          toast.success('Admin identity synced to Cloud');
          return;
        }
      } catch (err) { 
        console.warn('Admin ImgBB failed, trying local...', err);
      }

      // Local fallback
      const formDataLocal = new FormData();
      formDataLocal.append('image', file);
      try {
        const resLocal = await axios.post('/api/upload', formDataLocal);
        if (resLocal.data.imageUrl) {
          setProfile(prev => ({ ...prev, image: resLocal.data.imageUrl }));
          toast.success('Admin identity synced Locally');
        }
      } catch (localErr) {
        console.error('All Admin uploads failed:', localErr);
        toast.error('Identity sync failed');
      }
    };
    readerForBase64.readAsDataURL(file);
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-mono text-primary uppercase tracking-widest animate-pulse">Fetching Admin Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-display font-bold">Admin Profile</h3>
          <p className="text-foreground/40 text-xs">Manage your squad leadership identity</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Admin Name" value={profile.name || ''} onChange={v => setProfile({...profile, name: v})} />
          <Input label="Email Address (Locked)" value={profile.email || ''} onChange={() => {}} disabled />
          <Input label="Tech ID" value={profile.memberId || ''} onChange={v => setProfile({...profile, memberId: v})} />
          <Input label="Designation" value={profile.designation || ''} onChange={v => setProfile({...profile, designation: v})} />
           <Input label="Phone Number" value={profile.phone || ''} onChange={v => setProfile({...profile, phone: v})} />
          <Input label="Squad Team" value={profile.team || ''} onChange={v => setProfile({...profile, team: v})} />
          <Input label="Squad Role" value={profile.role || ''} onChange={v => setProfile({...profile, role: v})} />
          
          <div className="md:col-span-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1 mb-2">Leadership Bio</label>
            <textarea 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-foreground text-sm"
              rows={3}
              value={profile.bio || ''}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              placeholder="Tell the squad about yourself..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1 mb-2">Leadership Avatar</label>
            <div className="flex items-center gap-6 p-4 bg-surface border border-border rounded-xl">
              <div className="w-16 h-16 bg-surface rounded-full overflow-hidden flex items-center justify-center border border-border relative">
                {previewImage || profile.image ? <img src={previewImage || profile.image || undefined} className="w-full h-full object-cover" /> : <User size={24} className="text-foreground/10" />}
                {previewImage && <div className="absolute inset-0 bg-primary/40 flex items-center justify-center"><Rocket size={16} className="animate-bounce" /></div>}
              </div>
              <div className="flex-grow">
                <input type="file" accept="image/*" className="hidden" id="admin-photo-upload" onChange={handleImageChange} />
                <label htmlFor="admin-photo-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest">
                  Update Avatar
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Professional Bio</label>
          <textarea 
            className="w-full bg-surface border border-border rounded-xl p-4 focus:border-primary/50 outline-none h-32 text-foreground"
            value={profile.bio || ''}
            onChange={e => setProfile({...profile, bio: e.target.value})}
          />
        </div>
        <Button type="submit" className="flex items-center gap-2 px-8">
          <Save size={18} /> Update Admin Identity
        </Button>
      </form>
    </div>
  );
}

function ServiceForm() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({
    title: '', subtitle: '', description: '', image: '', images: '', link: ''
  });

  const fetchList = async () => {
    try {
      const res = await axios.get('/api/services');
      setList(res.data);
    } catch (err) {
      toast.error('Failed to fetch services');
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if ((data as any)._id) {
        await axios.put(`/api/services/${(data as any)._id}`, data);
        toast.success('Service updated!');
      } else {
        await axios.post('/api/services', data);
        toast.success('Service added!');
      }
      setIsModalOpen(false);
      setData({ title: '', subtitle: '', description: '', image: '', images: '', link: '' });
      fetchList();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      toast.success('Service deleted');
      fetchList();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const openEditModal = (service: any) => {
    setData(service);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setData({ title: '', subtitle: '', description: '', image: '', images: '', link: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-3xl font-display font-bold">Elite Services</h3>
          <p className="text-foreground/40 text-xs mt-1 uppercase tracking-widest font-mono">Quantum Node Management</p>
        </div>
        <Button onClick={openCreateModal} className="px-6 py-2 flex items-center gap-2">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(item => (
          <motion.div 
            key={item._id}
            whileHover={{ scale: 1.02 }}
            className="group relative"
          >
            <div 
              className="flex items-center justify-between p-6 glass rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all cursor-pointer bg-black/40 backdrop-blur-xl"
              onClick={() => openEditModal(item)}
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                  {item.image && <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />}
                </div>
                <div>
                  <h4 className="font-bold text-xl group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-mono mt-1">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {/* Subtle tech border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-[2.1rem] blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/90 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <Card className="p-10 md:p-16 border-primary/20 shadow-[0_0_50px_rgba(0,242,255,0.1)] rounded-[3rem] bg-surface/50 backdrop-blur-2xl relative overflow-hidden">
                {/* Modal Tech Background Decoration */}
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                  <Rocket size={400} />
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus className="rotate-45" size={28} />
                </button>

                <div className="relative z-10">
                  <h3 className="text-4xl font-display font-bold mb-2">
                    {(data as any)._id ? 'Synchronize Service' : 'Initialize Service'}
                  </h3>
                  <p className="text-primary/60 font-mono text-xs uppercase tracking-widest mb-12">System Node Configuration</p>

                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input label="Service Title" value={data.title} onChange={v => setData({ ...data, title: v })} placeholder="e.g. AI-Powered Solutions" />
                      <Input label="Subtitle" value={data.subtitle} onChange={v => setData({ ...data, subtitle: v })} placeholder="System designation" />
                      <div className="md:col-span-1">
                         <label className="text-xs font-mono uppercase tracking-widest text-foreground/40 block pl-1 mb-2">Main Interface Image</label>
                          <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl">
                            <div className="w-16 h-16 bg-surface rounded-lg overflow-hidden flex items-center justify-center border border-border">
                              {data.image ? <img src={data.image || undefined} className="w-full h-full object-cover" /> : <Rocket size={20} className="text-foreground/10" />}
                            </div>
                           <div className="flex-grow">
                             <input 
                               type="file" 
                               accept="image/*"
                               className="hidden" 
                               id="service-image-upload"
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 const readerForBase64 = new FileReader();
                                 readerForBase64.onloadend = async () => {
                                   const base64String = (readerForBase64.result as string).split(',')[1];
                                   const formDataImgBB = new FormData();
                                   formDataImgBB.append('image', base64String);
                                   const IMGBB_KEY = 'd0a7e8a0e9b16541d7071e4625452bd0';
                                   try {
                                     const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, formDataImgBB);
                                     if (res.data.success) {
                                       setData({ ...data, image: res.data.data.url });
                                       toast.success('Image hosted on Cloud!');
                                       return;
                                     }
                                   } catch (err) {
                                     console.warn('ImgBB failed, trying local...', err);
                                   }
                                   const formDataLocal = new FormData();
                                   formDataLocal.append('image', file);
                                   try {
                                     const resLocal = await axios.post('/api/upload', formDataLocal);
                                     if (resLocal.data.imageUrl) {
                                       setData({ ...data, image: resLocal.data.imageUrl });
                                       toast.success('Image hosted Locally!');
                                     }
                                   } catch (localErr) {
                                     toast.error('Image sync failed');
                                   }
                                 };
                                 readerForBase64.readAsDataURL(file);
                               }}
                             />
                             <label htmlFor="service-image-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-xs font-bold transition-all">
                                <Plus size={14} /> Upload
                             </label>
                           </div>
                         </div>
                      </div>
                      <Input label="Node Link" value={data.link} onChange={v => setData({ ...data, link: v })} placeholder="e.g. ai-solutions" />
                      
                      <div className="md:col-span-2">
                         <label className="text-xs font-mono uppercase tracking-widest text-foreground/40 block pl-1 mb-2">Multi-Node Matrix (Carousel Images)</label>
                          <div className="flex flex-col gap-4 p-4 bg-surface border border-border rounded-xl">
                            <div className="flex flex-wrap gap-2">
                              {data.images ? data.images.split(',').map((img, idx) => (
                                <div key={idx} className="w-16 h-16 bg-surface rounded-lg overflow-hidden border border-border relative group">
                                  <img src={img.trim()} className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => {
                                    const newImages = data.images.split(',').filter((_, i) => i !== idx).join(',');
                                    setData({ ...data, images: newImages });
                                  }} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} className="text-white" />
                                  </button>
                                </div>
                              )) : <p className="text-xs text-foreground/40">No images added</p>}
                            </div>
                             <input 
                               type="file" 
                               accept="image/*"
                               multiple
                               className="hidden" 
                               id="service-images-upload"
                               onChange={async (e) => {
                                 const files = Array.from(e.target.files || []);
                                 if (!files.length) return;
                                 toast.loading('Uploading images...', { id: 'multi-upload' });
                                 let newUrls: string[] = [];
                                 for (const file of files) {
                                   const formDataLocal = new FormData();
                                   formDataLocal.append('image', file);
                                   try {
                                     const resLocal = await axios.post('/api/upload', formDataLocal);
                                     if (resLocal.data.imageUrl) {
                                       newUrls.push(resLocal.data.imageUrl);
                                     }
                                   } catch (err) {
                                     console.error('Upload failed for a file', err);
                                   }
                                 }
                                 if (newUrls.length > 0) {
                                   const currentImages = data.images ? data.images.split(',').map(s=>s.trim()).filter(Boolean) : [];
                                   setData({ ...data, images: [...currentImages, ...newUrls].join(',') });
                                   toast.success('Images added!', { id: 'multi-upload' });
                                 } else {
                                   toast.error('Failed to upload images', { id: 'multi-upload' });
                                 }
                               }}
                             />
                             <label htmlFor="service-images-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-xs font-bold transition-all w-max">
                                <Plus size={14} /> Add Images
                             </label>
                         </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block pl-1 mb-4">Core Operational Description</label>
                        <textarea 
                          className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 focus:border-primary/50 outline-none h-48 text-foreground leading-relaxed transition-all focus:bg-black/60"
                          value={data.description}
                          onChange={e => setData({ ...data, description: e.target.value })}
                          placeholder="Detail the service core functionality..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit" disabled={loading} className="flex-grow py-5 text-lg font-display">
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : (data as any)._id ? 'Update System Node' : 'Deploy New Node'}
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="px-10">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      if ((data as any)._id) {
        await axios.put(`/api/projects/${(data as any)._id}`, {
          ...data,
          techStack: Array.isArray(data.techStack) ? data.techStack : data.techStack.split(',').map(s => s.trim())
        });
        toast.success('Project updated successfully!');
      } else {
        await axios.post('/api/projects', {
          ...data,
          techStack: data.techStack.split(',').map(s => s.trim()),
          userId: user?.id,
          developerName: user?.name || 'Admin'
        });
        toast.success('Project added successfully!');
      }
      setData({ 
        title: '', description: '', image: '', techStack: '', liveLink: '',
        orderId: '', clientName: '', profileName: '', sheetLink: '', value: '', totalValue: '', projectType: 'solo'
      });
      fetchList();
    } catch (err) {
      toast.error('Failed to save project');
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
            <Input label="Project Title" value={data.title || ''} onChange={v => setData({ ...data, title: v })} placeholder="e.g. Nexus Dashboard" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Type</label>
            <select 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:border-primary/50 outline-none text-foreground"
              value={data.projectType || 'solo'}
              onChange={e => setData({ ...data, projectType: e.target.value })}
            >
              <option value="solo" className="bg-bg">Solo</option>
              <option value="combine" className="bg-bg">Combine</option>
              <option value="leader" className="bg-bg">Leader</option>
              <option value="squad" className="bg-bg">Squad</option>
            </select>
          </div>
          <Input label="Order ID" value={data.orderId || ''} onChange={v => setData({ ...data, orderId: v })} placeholder="ORD-123" />
          <Input label="Client Name" value={data.clientName || ''} onChange={v => setData({ ...data, clientName: v })} placeholder="John Doe" />
          <Input label="Profile Name" value={data.profileName || ''} onChange={v => setData({ ...data, profileName: v })} placeholder="Fiverr / Upwork" />
          <Input label="Project Value ($)" value={data.value || ''} onChange={v => setData({ ...data, value: v })} placeholder="500" />
          <Input label="Total Value ($)" value={data.totalValue || ''} onChange={v => setData({ ...data, totalValue: v })} placeholder="1000" />
          <Input label="Tech Stack (comma separated)" value={data.techStack || ''} onChange={v => setData({ ...data, techStack: v })} placeholder="React, Node, MongoDB" />
          <Input label="Developer Name" value={data.developerName || ''} onChange={v => setData({ ...data, developerName: v })} placeholder="e.g. John Doe / Admin" />
          <div className="md:col-span-2 lg:col-span-3">
             <Input label="Sheet / Document Link" value={data.sheetLink || ''} onChange={v => setData({ ...data, sheetLink: v })} placeholder="https://docs.google.com/..." />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
             <label className="text-xs font-mono uppercase tracking-widest text-foreground/40 block pl-1 mb-2">Project Image</label>
              <div className="flex items-center gap-6 p-4 bg-surface border border-border rounded-xl">
                <div className="w-20 h-20 bg-surface rounded-lg overflow-hidden flex items-center justify-center border border-border">
                  {data.image ? <img src={data.image || undefined} className="w-full h-full object-cover" /> : <LayoutDashboard size={24} className="text-foreground/10" />}
                </div>
               <div className="flex-grow">
                 <input 
                   type="file" 
                   accept="image/*"
                   className="hidden" 
                   id="project-image-upload"
                   onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (!file) return;
                     const readerForBase64 = new FileReader();
                     readerForBase64.onloadend = async () => {
                       const base64String = (readerForBase64.result as string).split(',')[1];
                       const formDataImgBB = new FormData();
                       formDataImgBB.append('image', base64String);
                       const IMGBB_KEY = 'd0a7e8a0e9b16541d7071e4625452bd0';
                       try {
                         const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, formDataImgBB);
                         if (res.data.success) {
                           setData({ ...data, image: res.data.data.url });
                           toast.success('Project hosted on Cloud!');
                           return;
                         }
                       } catch (err) {
                         console.warn('Project ImgBB failed, trying local...', err);
                       }

                       // Local fallback
                       const formDataLocal = new FormData();
                       formDataLocal.append('image', file);
                       try {
                         const resLocal = await axios.post('/api/upload', formDataLocal);
                         if (resLocal.data.imageUrl) {
                           setData({ ...data, image: resLocal.data.imageUrl });
                           toast.success('Project hosted Locally!');
                         }
                       } catch (localErr) {
                         console.error('All project uploads failed:', localErr);
                         toast.error('Project image sync failed');
                       }
                     };
                     readerForBase64.readAsDataURL(file);
                   }}
                 />
                 <label htmlFor="project-image-upload" className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-sm font-bold transition-all">
                    <Plus size={16} /> Choose Local Device
                 </label>
                 <p className="text-[10px] text-white/20 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
               </div>
             </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Input label="Live Link" value={data.liveLink || ''} onChange={v => setData({ ...data, liveLink: v })} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Description</label>
          <textarea 
            className="w-full bg-surface border border-border rounded-xl p-4 focus:border-primary/50 outline-none resize-none h-32 text-foreground"
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
                  <div className="flex items-center gap-4 text-xs text-foreground/40 font-mono">
                    <span>ID: {item.orderId || 'N/A'}</span>
                    <span>•</span>
                    <span className="text-primary">${item.value || '0'}</span>
                    <span>•</span>
                    <span className="text-foreground/60">Dev: {item.developerName || 'Member'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Link to={`/projects/${item._id}`}>
                  <button className="p-2 text-white/20 hover:text-primary transition-all" title="View Full Page">
                    <ExternalLink size={18} />
                  </button>
                </Link>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setData({
                      ...item,
                      techStack: Array.isArray(item.techStack) ? item.techStack.join(', ') : item.techStack
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="p-2 text-white/20 hover:text-primary transition-all"
                  title="Edit Project"
                >
                  <Plus className="rotate-45" size={18} />
                </button>
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
                  <h5 className="text-xs font-mono uppercase text-foreground/20 mb-3">Description</h5>
                  <p className="text-foreground/60 leading-relaxed italic">"{selectedProject.description}"</p>
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
      if (data._id) {
        await axios.put(`/api/admin/users/${data._id}`, data);
        toast.success('Member updated successfully!');
      } else {
        await axios.post('/api/auth/register', data);
        toast.success('Member added successfully!');
      }
      setData({ email: '', password: 'password123', name: '', memberId: '', designation: '', team: '', phone: '', role: 'Member' });
      fetchList();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Operation failed');
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

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    try {
      await axios.put(`/api/admin/users/${selectedUser._id}`, selectedUser);
      toast.success('Member updated successfully!');
      setSelectedUser(null);
      fetchList();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
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
            <div 
              key={item._id} 
              className="flex flex-col md:flex-row md:items-center justify-between p-6 glass rounded-2xl group hover:border-primary/30 transition-all gap-6 cursor-pointer"
              onClick={() => setSelectedUser(item)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center font-bold text-primary relative overflow-hidden">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : (item.name?.[0] || 'U')}
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
              
              <div className="flex flex-wrap items-center gap-3" onClick={e => e.stopPropagation()}>
                 <button 
                  onClick={() => handleVerifyToggle(item._id, item.isVerified)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${
                    item.isVerified ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {item.isVerified ? 'Verified' : 'Verify'}
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

      {/* Member Details Popup */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={() => setSelectedUser(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Edit Member Data</h3>
                <button onClick={() => setSelectedUser(null)}><Plus className="rotate-45 text-white/20 hover:text-white" /></button>
              </div>

              <form onSubmit={handleUpdateMember} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Name" value={selectedUser.name || ''} onChange={v => setSelectedUser({...selectedUser, name: v})} />
                  <Input label="Email" value={selectedUser.email || ''} onChange={() => {}} disabled />
                  <Input label="Tech ID" value={selectedUser.memberId || ''} onChange={v => setSelectedUser({...selectedUser, memberId: v})} />
                  <Input label="Designation" value={selectedUser.designation || ''} onChange={v => setSelectedUser({...selectedUser, designation: v})} />
                  <Input label="Team" value={selectedUser.team || ''} onChange={v => setSelectedUser({...selectedUser, team: v})} />
                  <Input label="Phone" value={selectedUser.phone || ''} onChange={v => setSelectedUser({...selectedUser, phone: v})} />
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Squad Role</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      value={selectedUser.role || 'Member'}
                      onChange={e => setSelectedUser({...selectedUser, role: e.target.value})}
                    >
                      <option value="Member" className="bg-bg">Member</option>
                      <option value="Leader" className="bg-bg">Leader (Admin)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Verification Status</label>
                    <button 
                      type="button"
                      onClick={() => setSelectedUser({...selectedUser, isVerified: !selectedUser.isVerified})}
                      className={`w-full py-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${
                        selectedUser.isVerified ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {selectedUser.isVerified ? 'Verified Member' : 'Unverified'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Member Bio</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white h-24"
                    value={selectedUser.bio || ''}
                    onChange={e => setSelectedUser({...selectedUser, bio: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-grow flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18} /> Update Data</>}
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setSelectedUser(null)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
        <h3 className="text-xl font-bold mb-6">Testimonials ({list.length})</h3>
        {list.map(item => (
          <div key={item._id} className="flex items-center justify-between p-6 glass rounded-2xl group hover:border-primary/30 transition-all gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold">{item.clientName}</h4>
                <div className="flex gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={10} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "text-yellow-500" : "text-white/10"} />
                   ))}
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed italic line-clamp-2">"{item.feedback}"</p>
              <div className="flex gap-4 mt-2 text-[10px] text-white/20 font-mono uppercase">
                <span>By: {item.developerName}</span>
                {item.orderId && <span>Order: {item.orderId}</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(item._id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
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



function Input({ label, value, onChange, placeholder = '', type = 'text', disabled = false }: { label: string, value: any, onChange: (v: string) => void, placeholder?: string, type?: string, disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">{label}</label>
      <input 
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}
