import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Star, Loader2, Trash2, ShieldCheck, Plus, Save, ExternalLink, Edit2, Rocket, LayoutDashboard, User } from 'lucide-react';
import { Button, Card, Input as UIInput } from '../../components/UI';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Local Input component similar to AdminDashboard for consistency
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

export default function AdminMemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Project editing state
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [tempProject, setTempProject] = useState<any>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [memberRes, projectsRes] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/projects?userId=${id}`)
      ]);
      setMember(memberRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      toast.error('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/admin/users/${id}`, member);
      toast.success('Member profile updated successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`/api/projects/${projectId}`);
      toast.success('Project deleted');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleSaveProject = async () => {
    setSaving(true);
    try {
      const techStackArray = typeof tempProject.techStack === 'string' 
        ? tempProject.techStack.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
        : tempProject.techStack;
      
      await axios.put(`/api/projects/${tempProject._id}`, {
        ...tempProject,
        techStack: techStackArray
      });
      toast.success('Project updated');
      setIsEditingProject(false);
      setSelectedProject(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-xs font-mono uppercase tracking-widest text-primary animate-pulse">Initializing Administrative Node...</p>
    </div>
  );
  
  if (!member) return <div className="h-screen flex items-center justify-center">Member Node Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
           <Link to="/admin/dashboard?tab=members" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-4 group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-mono uppercase tracking-widest">Return to Members Hub</span>
           </Link>
           <h1 className="text-4xl font-display font-bold">Manage: {member.name}</h1>
           <p className="text-white/40 text-xs uppercase tracking-widest font-mono mt-1">Direct Administrative Override Access</p>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${member.isVerified ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/40'}`}>
              {member.isVerified ? 'Verified System Member' : 'Unverified Identity'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Profile Edit */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-8 glass sticky top-32">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <User size={20} className="text-primary" />
              Member Profile
            </h3>
            
            <form onSubmit={handleUpdateMember} className="space-y-6">
              <div className="w-24 h-24 bg-primary/20 rounded-2xl mx-auto overflow-hidden border border-primary/30 relative group">
                {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">{member.name[0]}</div>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                   <p className="text-[8px] font-bold uppercase">Change</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input label="Name" value={member.name} onChange={v => setMember({ ...member, name: v })} />
                <Input label="Email" value={member.email} onChange={() => {}} disabled />
                <Input label="Tech ID" value={member.memberId || ''} onChange={v => setMember({ ...member, memberId: v })} />
                <Input label="Designation" value={member.designation || ''} onChange={v => setMember({ ...member, designation: v })} />
                <Input label="Team" value={member.team || ''} onChange={v => setMember({ ...member, team: v })} />
                <Input label="Phone" value={member.phone || ''} onChange={v => setMember({ ...member, phone: v })} />
                
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-white/40 block pl-1">Squad Role</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    value={member.role || 'Member'}
                    onChange={e => setMember({ ...member, role: e.target.value })}
                  >
                    <option value="Member" className="bg-bg">Member</option>
                    <option value="Leader" className="bg-bg">Leader (Admin)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setMember({ ...member, isVerified: !member.isVerified })}
                    className={`w-full py-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest mb-4 ${
                      member.isVerified ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {member.isVerified ? 'Verified Member' : 'Set As Verified'}
                  </button>
                  <Button type="submit" className="w-full py-4 flex items-center justify-center gap-2" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Identity Update</>}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Right: Projects Management */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold">Contribution Matrix</h3>
              <p className="text-[10px] font-mono text-white/40">{projects.length} PROJECTS FOUND</p>
           </div>
           
           <div className="grid grid-cols-1 gap-6">
             {projects.length === 0 ? (
               <Card className="p-20 text-center border-dashed border-white/10">
                 <LayoutDashboard className="mx-auto text-white/10 mb-6" size={48} />
                 <p className="text-white/40 italic">This member has no digital contributions yet.</p>
               </Card>
             ) : (
               projects.map(proj => (
                 <div key={proj._id} className="group relative">
                   <div 
                     className="flex flex-col md:flex-row items-center gap-6 p-6 glass rounded-3xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                     onClick={() => setSelectedProject(proj)}
                   >
                     <div className="w-full md:w-32 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-white/5">
                        <img src={proj.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                     </div>
                     <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-xl">{proj.title}</h4>
                          <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{proj.projectType}</span>
                        </div>
                        <p className="text-sm text-white/60 mb-4 line-clamp-1">{proj.description}</p>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                           <span className="text-primary font-bold">My Achievement Value: ${proj.value || '0'}</span>
                           <span>•</span>
                           <span>ID: {proj.orderId || 'N/A'}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            setSelectedProject(proj);
                            setIsEditingProject(true);
                            setTempProject({
                              ...proj,
                              techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack
                            });
                          }} 
                          className="p-3 bg-white/5 hover:bg-primary text-white/40 hover:text-white rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteProject(proj._id)} className="p-3 bg-white/5 hover:bg-red-500 text-white/40 hover:text-white rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>

      {/* Project Mastery Modal (Copy from AdminDashboard but isolated) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedProject(null); setIsEditingProject(false); }} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-5xl glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
               <div className="md:w-2/5 relative bg-black flex items-center justify-center">
                 <img src={isEditingProject ? tempProject.image : selectedProject.image} className="w-full h-full object-contain" alt="" />
                 <button onClick={() => { setSelectedProject(null); setIsEditingProject(false); }} className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-primary transition-colors z-20"><Plus size={20} className="rotate-45" /></button>
               </div>
               
               <div className="md:w-3/5 p-10 overflow-y-auto bg-black/20">
                 {!isEditingProject ? (
                   <div className="space-y-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-4xl font-display font-bold text-white mb-2">{selectedProject.title}</h2>
                          <div className="flex flex-wrap gap-2">
                             <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold rounded-full uppercase tracking-widest">{selectedProject.projectType}</span>
                             <span className="px-3 py-1 bg-white/5 text-white/40 border border-white/10 text-[10px] font-bold rounded-full uppercase tracking-widest">Status: {selectedProject.status}</span>
                          </div>
                        </div>
                        <button onClick={() => { setIsEditingProject(true); setTempProject({ ...selectedProject, techStack: Array.isArray(selectedProject.techStack) ? selectedProject.techStack.join(', ') : selectedProject.techStack }); }} className="p-3 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-xl transition-all border border-primary/30"><Edit2 size={20} /></button>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-primary mb-3">Narrative</h4>
                        <p className="text-white/60 text-sm leading-relaxed">{selectedProject.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                           <h4 className="text-[10px] uppercase font-mono tracking-widest text-primary mb-2">My Achievement Value</h4>
                           <p className="text-xl font-bold text-white">${selectedProject.value || '0.00'}</p>
                        </div>
                        <div>
                           <h4 className="text-[10px] uppercase font-mono tracking-widest text-primary mb-2">Total Project</h4>
                           <p className="text-xl font-bold text-white">${selectedProject.totalValue || '0.00'}</p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                        {selectedProject.liveLink && (
                          <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="flex-grow">
                             <Button className="w-full py-4 flex items-center justify-center gap-2"><Rocket size={18} /> View Live Link</Button>
                          </a>
                        )}
                        <Button variant="outline" onClick={() => setSelectedProject(null)} className="flex-grow">Dismiss</Button>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">Project Mastery Edit</h2>
                        <div className="flex gap-2">
                          <button onClick={() => setIsEditingProject(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all border border-white/10">Cancel</button>
                          <button onClick={handleSaveProject} className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Save Changes</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Input label="Project Title" value={tempProject.title} onChange={v => setTempProject({...tempProject, title: v})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block pl-1 mb-2">Status</label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" value={tempProject.status} onChange={e => setTempProject({...tempProject, status: e.target.value})}>
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="wip">WIP</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block pl-1 mb-2">Project Type</label>
                           <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" value={tempProject.projectType} onChange={e => setTempProject({...tempProject, projectType: e.target.value})}>
                             <option value="solo">Solo</option>
                             <option value="combine">Combine</option>
                             <option value="leader">Leader</option>
                             <option value="squad">Squad</option>
                           </select>
                        </div>
                        <div>
                           <Input label="My Achievement Value ($)" value={tempProject.value} onChange={v => setTempProject({...tempProject, value: v})} />
                        </div>
                        <div>
                           <Input label="Total Project Value ($)" value={tempProject.totalValue} onChange={v => setTempProject({...tempProject, totalValue: v})} />
                        </div>
                        <div className="col-span-2">
                           <Input label="Tech Stack (comma separated)" value={tempProject.techStack} onChange={v => setTempProject({...tempProject, techStack: v})} />
                        </div>
                        <div className="col-span-2">
                           <Input label="Live Link" value={tempProject.liveLink} onChange={v => setTempProject({...tempProject, liveLink: v})} />
                        </div>
                        <div className="col-span-2">
                           <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block pl-1 mb-2">Description</label>
                           <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white h-32" value={tempProject.description} onChange={e => setTempProject({...tempProject, description: e.target.value})} />
                        </div>
                      </div>
                   </div>
                 )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
