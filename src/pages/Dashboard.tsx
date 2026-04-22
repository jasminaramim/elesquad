import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, SectionHeading } from '../components/UI';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Briefcase, 
  Star, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronRight,
  ExternalLink,
  DollarSign,
  Calendar,
  BarChart3,
  MessageCircle
} from 'lucide-react';
import ChatHub from '../components/ChatHub';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'reviews' | 'documents' | 'finance' | 'messages'>('profile');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    techStack: '',
    liveLink: '',
    githubLink: '',
    orderId: '',
    clientName: '',
    profileName: '',
    sheetLink: '',
    value: '',
    totalValue: '',
    projectType: 'solo'
  });
  const [profile, setProfile] = useState({ 
    name: '', 
    email: '',
    memberId: '',
    designation: '',
    team: '',
    phone: '',
    bio: '', 
    image: '' 
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user]);

  useEffect(() => {
    if (projects.length > 0) {
       const sorted = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
       const latest = sorted[0];
       if (latest && !selectedMonth) {
         setSelectedMonth(new Date(latest.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }));
       }
    }
  }, [projects]);

  const refreshData = async () => {
    try {
      const [uRes, pRes, rRes, dRes] = await Promise.all([
        axios.get(`/api/users/${user?.id}`),
        axios.get(`/api/projects?userId=${user?.id}`),
        axios.get('/api/reviews'),
        axios.get(`/api/documents?userId=${user?.id}`)
      ]);
      setProfile(uRes.data);
      setProjects(pRes.data);
      setReviews(rRes.data.filter((r: any) => r.userId === user?.id));
      setDocuments(dRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${user?.id}`, profile);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/projects/${id}/publish`, { isPublished: !currentStatus });
      toast.success(currentStatus ? 'Project unpublished' : 'Project published!');
      refreshData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const [newReview, setNewReview] = useState({
    title: '',
    clientName: '',
    orderId: '',
    feedback: '',
    rating: 5
  });

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', {
        ...newReview,
        userId: user?.id,
        developerName: profile.name || user?.name || 'Team Member'
      });
      toast.success('Review added successfully');
      setNewReview({ title: '', clientName: '', orderId: '', feedback: '', rating: 5 });
      refreshData();
    } catch (err) {
      toast.error('Failed to add review');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const techStackArray = typeof newProject.techStack === 'string' 
        ? newProject.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
        : newProject.techStack;

      if ((newProject as any)._id) {
        await axios.put(`/api/projects/${(newProject as any)._id}`, {
          ...newProject,
          techStack: techStackArray
        });
        toast.success('Project updated successfully');
      } else {
        await axios.post('/api/projects', {
          ...newProject,
          techStack: techStackArray,
          userId: user?.id,
          developerName: profile.name || user?.name || 'Team Member'
        });
        toast.success('Project added successfully');
      }
      setShowAddProject(false);
      setNewProject({
        title: '', description: '', image: '', techStack: '', liveLink: '', githubLink: '',
        orderId: '', clientName: '', profileName: '', sheetLink: '', value: '', totalValue: '', projectType: 'solo'
      });
      refreshData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const deleteItem = async (type: string, id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/${type}/${id}`);
      toast.success('Deleted successfully');
      refreshData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Sidebar Nav */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="p-6 border-white/10 glass sticky top-32">
          <div className="flex items-center gap-4 mb-8 p-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight">{profile.name || user.email?.split('@')[0] || 'Member'}</h3>
              <p className="text-[10px] uppercase text-primary font-mono tracking-widest mb-1">{profile.designation || 'Squad Member'}</p>
              <p className="text-[9px] uppercase text-white/30 tracking-widest">{profile.memberId || 'ES-000'}</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'profile', icon: User, label: 'Profile Settings' },
              { id: 'projects', icon: Briefcase, label: 'My Projects' },
              { id: 'finance', icon: DollarSign, label: 'Financial Overview' },
              { id: 'messages', icon: MessageCircle, label: 'Squad Messages' },
              { id: 'reviews', icon: Star, label: 'My Reviews' },
              { id: 'documents', icon: FileText, label: 'My Sheets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
             <button 
               onClick={logout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-sm"
             >
               <LogOut size={18} />
               Log Out
             </button>
          </div>
        </Card>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'messages' && <ChatHub />}
            {activeTab === 'finance' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-3xl font-display font-bold text-white">Financial Hub</h3>
                    <p className="text-white/40 text-sm">Track your earnings and monthly project load</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-primary uppercase font-mono tracking-widest mb-1">Lifetime Earnings</p>
                    <h4 className="text-2xl font-bold text-white">
                      ${projects.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0).toFixed(2)}
                    </h4>
                  </div>
               </div>

                {/* Monthly Selector Card */}
               <Card className="p-8 border-white/5 glass">
                  <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {Array.from(new Set(projects.map((p: any) => {
                      const d = new Date(p.createdAt);
                      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
                    }))).sort((a: any, b: any) => {
                      return new Date(b).getTime() - new Date(a).getTime();
                    }).map((month: any) => {
                      const monthlyTotal = projects
                        .filter((p: any) => new Date(p.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === month)
                        .reduce((acc: number, curr: any) => acc + (parseFloat(curr.value) || 0), 0);

                      const monthParts = month.split(' ');
                      return (
                        <button
                          key={month}
                          onClick={() => setSelectedMonth(month)}
                          className={cn(
                            "flex flex-col items-center justify-center min-w-[120px] p-5 rounded-2xl border transition-all",
                            selectedMonth === month 
                              ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(108,77,246,0.3)]" 
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          )}
                        >
                          <span className={cn("text-[10px] font-mono uppercase tracking-widest mb-2", selectedMonth === month ? "text-primary" : "text-white/40")}>
                            {monthParts[0]?.substring(0, 3)} {monthParts[1]}
                          </span>
                          <span className="text-lg font-bold text-white">${monthlyTotal.toFixed(0)}</span>
                        </button>
                      );
                    })}
                    {projects.length === 0 && <p className="text-white/20 italic text-sm">No project data available to generate timeline.</p>}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                       <Calendar size={18} className="text-primary" />
                       <h4 className="text-xl font-bold">{selectedMonth} Analysis</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                       {[
                         { label: 'Projects Completed', value: projects.filter((p: any) => new Date(p.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth).length, icon: Briefcase },
                         { label: 'Monthly Revenue', value: `$${projects.filter((p: any) => new Date(p.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth).reduce((acc: number, curr: any) => acc + (parseFloat(curr.value) || 0), 0).toFixed(2)}`, icon: DollarSign },
                         { label: 'Avg Project Value', value: `$${(projects.filter((p: any) => new Date(p.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth).reduce((acc: number, curr: any) => acc + (parseFloat(curr.value) || 0), 0) / (projects.filter((p: any) => new Date(p.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth).length || 1)).toFixed(2)}`, icon: BarChart3 },
                       ].map((stat, i) => (
                         <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <stat.icon size={16} className="text-primary mb-3" />
                            <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                         </div>
                       ))}
                    </div>

                    <h5 className="text-xs font-mono uppercase text-white/20 tracking-tighter mb-4 pt-4 border-t border-white/5">Projects from {selectedMonth}</h5>
                    <div className="space-y-3">
                      {projects
                        .filter((p: any) => new Date(p.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth)
                        .map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                <p className="font-bold text-white group-hover:text-primary transition-colors">{p.title}</p>
                                <p className="text-[10px] text-white/40 font-mono uppercase">{p.projectType} • {new Date(p.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                               <p className="text-md font-bold text-white">${parseFloat(p.value).toFixed(2)}</p>
                               <p className="text-[9px] text-primary/60 font-mono uppercase">Order ID: {p.orderId || 'N/A'}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
               </Card>
            </div>
          )}
          {activeTab === 'profile' && (
            <Card className="p-10 border-white/10 glass">
              <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-3xl font-display font-bold">Edit Profile</h3>
                   <p className="text-white/40 text-xs">Update your professional identity</p>
                </div>
                <div className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-mono text-primary uppercase tracking-widest">
                   {profile.memberId || 'ES-MEMBER'}
                </div>
              </div>

              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-style">Display Name</label>
                    <input 
                      className="input-style" 
                      value={profile.name || ''} 
                      onChange={e => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label-style">Email Address (Read-Only)</label>
                    <input 
                      className="input-style opacity-50 cursor-not-allowed" 
                      value={profile.email || ''} 
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label-style">Designation</label>
                    <input 
                      className="input-style" 
                      placeholder="e.g. Senior Frontend Dev"
                      value={profile.designation || ''} 
                      onChange={e => setProfile({...profile, designation: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label-style">Team</label>
                    <input 
                      className="input-style" 
                      placeholder="e.g. Alpha Squad"
                      value={profile.team || ''} 
                      onChange={e => setProfile({...profile, team: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label-style">Phone Number</label>
                    <input 
                      className="input-style" 
                      value={profile.phone || ''} 
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label-style">Profile Photo</label>
                    <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
                        {profile.image ? <img src={profile.image} className="w-full h-full object-cover" /> : <User size={20} className="opacity-20" />}
                      </div>
                      <div className="flex-grow">
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          id="profile-upload"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            try {
                              const res = await axios.post('/api/upload', formData);
                              setProfile({ ...profile, image: res.data.imageUrl });
                              toast.success('Photo uploaded!');
                            } catch (err) {
                              toast.error('Upload failed');
                            }
                          }}
                        />
                        <label htmlFor="profile-upload" className="cursor-pointer px-4 py-1.5 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest">
                           Upload Image
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                   <label className="label-style">Bio</label>
                   <textarea 
                     rows={4} 
                     className="input-style" 
                     value={profile.bio || ''} 
                     onChange={e => setProfile({...profile, bio: e.target.value})}
                   />
                </div>
                <Button type="submit" className="w-full md:w-auto px-12">Update Professional Record</Button>
              </form>
            </Card>
          )}

          {activeTab === 'projects' && (
             <div className="space-y-6">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-bold">My Projects</h3>
                 <Button onClick={() => setShowAddProject(!showAddProject)} className="py-2 px-6 text-sm flex items-center gap-2">
                    {showAddProject ? 'Cancel' : <><Plus size={16} /> Add Project</>}
                 </Button>
               </div>

               {showAddProject && (
                 <Card className="p-8 border-primary/20 mb-12 bg-primary/5">
                    <form onSubmit={handleAddProject} className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                             <label className="label-style">Project Title</label>
                             <input required className="input-style" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                          </div>
                          <div>
                             <label className="label-style">Project Type</label>
                             <select className="input-style" value={newProject.projectType} onChange={e => setNewProject({...newProject, projectType: e.target.value})}>
                                <option value="solo">Solo</option>
                                <option value="combine">Combine</option>
                                <option value="leader">Leader</option>
                                <option value="squad">Squad</option>
                             </select>
                          </div>
                          <div>
                             <label className="label-style">Order ID</label>
                             <input className="input-style" value={newProject.orderId} onChange={e => setNewProject({...newProject, orderId: e.target.value})} />
                          </div>
                          <div>
                             <label className="label-style">Client Name</label>
                             <input className="input-style" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} />
                          </div>
                          <div>
                             <label className="label-style">Profile Name</label>
                             <input className="input-style" value={newProject.profileName} onChange={e => setNewProject({...newProject, profileName: e.target.value})} />
                          </div>
                          <div>
                             <label className="label-style">Project Value</label>
                             <input className="input-style" value={newProject.value} onChange={e => setNewProject({...newProject, value: e.target.value})} />
                          </div>
                          <div>
                             <label className="label-style">Total Value</label>
                             <input className="input-style" value={newProject.totalValue} onChange={e => setNewProject({...newProject, totalValue: e.target.value})} />
                          </div>
                          <div className="md:col-span-2 lg:col-span-3">
                             <label className="label-style">Sheet Link</label>
                             <input className="input-style" value={newProject.sheetLink} onChange={e => setNewProject({...newProject, sheetLink: e.target.value})} placeholder="https://docs.google.com/..." />
                          </div>
                           <div className="md:col-span-2 lg:col-span-3">
                              <label className="label-style">Project Image</label>
                              <div className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center border border-white/10">
                                  {newProject.image ? <img src={newProject.image} className="w-full h-full object-cover" /> : <Briefcase size={20} className="opacity-10" />}
                                </div>
                                <div className="flex-grow">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden" 
                                    id="dashboard-project-upload"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const formData = new FormData();
                                      formData.append('image', file);
                                      try {
                                        const res = await axios.post('/api/upload', formData);
                                        setNewProject({ ...newProject, image: res.data.imageUrl });
                                        toast.success('Image uploaded!');
                                      } catch (err) {
                                        toast.error('Upload failed');
                                      }
                                    }}
                                  />
                                  <label htmlFor="dashboard-project-upload" className="cursor-pointer px-6 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-xs font-bold transition-all uppercase">
                                     Select From Local Device
                                  </label>
                                </div>
                              </div>
                           </div>
                       </div>
                       <div>
                          <label className="label-style">Description</label>
                          <textarea rows={3} className="input-style" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                       </div>
                       <Button type="submit">Submit Project</Button>
                    </form>
                 </Card>
               )}

               {projects.length === 0 ? (
                 <p className="text-center py-20 text-white/20 italic">No projects found. Add your first masterpiece!</p>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((p: any) => (
                      <Card key={p._id} className="p-0 overflow-hidden border-white/5 hover:border-primary/50 transition-all flex flex-col">
                        <Link to={`/projects/${p._id}`} className="aspect-video relative block">
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                          <div className="absolute top-4 right-4 flex gap-2">
                             <button 
                               onClick={(e) => {
                                 e.preventDefault();
                                 setNewProject({ ...p, techStack: p.techStack.join(', ') });
                                 setShowAddProject(true);
                                 window.scrollTo({ top: 0, behavior: 'smooth' });
                               }}
                               className="p-2 bg-primary/80 backdrop-blur rounded-lg text-white hover:bg-primary transition-colors"
                             >
                               <Edit3 size={16} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.preventDefault();
                                 deleteItem('projects', p._id);
                               }} 
                               className="p-2 bg-red-500/80 backdrop-blur rounded-lg text-white hover:bg-red-600 transition-colors"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                          {p.projectType && (
                            <div className="absolute bottom-4 left-4">
                               <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                  {p.projectType}
                               </span>
                            </div>
                          )}
                        </Link>
                        <div className="p-6 flex-grow">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xl font-bold">{p.title}</h4>
                              <span className="text-primary font-mono text-sm">{p.value ? `$${p.value}` : ''}</span>
                           </div>
                           <p className="text-white/40 text-sm mb-4 line-clamp-2">{p.description}</p>
                           
                           <div className="flex items-center justify-between mb-4">
                              <button 
                                onClick={() => togglePublish(p._id, p.isPublished)}
                                className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full transition-all ${
                                  p.isPublished 
                                    ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                                    : 'bg-white/5 text-white/40 border border-white/10 hover:border-primary/50 hover:text-white'
                                }`}
                              >
                                {p.isPublished ? 'Published' : 'Click to Publish'}
                              </button>
                           </div>

                           {p.sheetLink && (
                             <a href={p.sheetLink} target="_blank" rel="noopener noreferrer" className="block mb-4">
                                <Button variant="outline" className="w-full py-2 text-xs flex items-center justify-center gap-2">
                                   View Team Sheet <ExternalLink size={14} />
                                </Button>
                             </a>
                           )}

                           <div className="flex gap-2 flex-wrap">
                             {p.techStack && p.techStack.map((t: string) => (
                               <span key={t} className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-mono">{t}</span>
                             ))}
                           </div>
                        </div>
                      </Card>
                    ))}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">My Reviews</h3>
              </div>
              
              <Card className="p-8 border-primary/20 mb-12 bg-primary/5">
                <form onSubmit={handleAddReview} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="label-style">Review Title</label>
                      <input required className="input-style" value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} placeholder="Great experience!" />
                    </div>
                    <div>
                      <label className="label-style">Rating (1-5)</label>
                      <input type="number" min="1" max="5" className="input-style" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label className="label-style">Client Name</label>
                      <input required className="input-style" value={newReview.clientName} onChange={e => setNewReview({...newReview, clientName: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Order ID</label>
                      <input className="input-style" value={newReview.orderId} onChange={e => setNewReview({...newReview, orderId: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">What your client said</label>
                    <textarea rows={4} required className="input-style" value={newReview.feedback} onChange={e => setNewReview({...newReview, feedback: e.target.value})} />
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              </Card>

              {reviews.length === 0 ? (
                <p className="text-center py-20 text-white/20 italic">You haven't shared any reviews yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {reviews.map((r: any) => (
                     <Card key={r._id} className="p-6 border-white/5 backdrop-blur-3xl bg-white/[0.02]">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-lg">{r.title}</h4>
                            <p className="text-[10px] text-primary font-mono uppercase tracking-widest">{r.clientName}</p>
                          </div>
                          <button onClick={() => deleteItem('reviews', r._id)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-yellow-500" : "text-white/20"} />
                            ))}
                        </div>
                        <p className="text-white/60 italic text-sm">"{r.feedback}"</p>
                        {r.orderId && <p className="mt-4 text-[9px] text-white/20 font-mono">Order ID: {r.orderId}</p>}
                     </Card>
                   ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">My Sheets (Documents)</h3>
                <Link to="/editor/new">
                  <Button className="py-2 px-6 text-sm flex items-center gap-2">
                     <Plus size={16} /> New Sheet
                  </Button>
                </Link>
              </div>
              {documents.length === 0 ? (
                <p className="text-center py-20 text-white/20 italic">Your digital workspace is empty.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {documents.map((doc: any) => (
                     <Link key={doc.id} to={`/editor/${doc.id}`}>
                        <Card className="group hover:border-primary/50 transition-all p-8 flex flex-col items-center text-center">
                           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary transition-colors">
                              <FileText className="text-primary group-hover:text-white" size={32} />
                           </div>
                           <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">{doc.title}</h4>
                           <p className="text-[10px] uppercase text-white/40 font-mono">Updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
                           <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="text-primary" />
                           </div>
                        </Card>
                     </Link>
                   ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .input-style {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          outline: none;
          transition: all 0.3s;
          color: white;
        }
        .input-style:focus {
          border-color: #6C4DF6;
          background: rgba(255, 255, 255, 0.08);
        }
        .label-style {
          display: block;
          font-family: monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
