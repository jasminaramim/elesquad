import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { motion } from 'motion/react';
import { Button, Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Save, ChevronLeft, Layout, FileText } from 'lucide-react';

export default function DocumentEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('New Sheet');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id !== 'new') {
      axios.get(`/api/documents/${id}`).then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [id, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (id === 'new') {
        const res = await axios.post('/api/documents', {
          userId: user?.id,
          title,
          content
        });
        navigate(`/editor/${res.data.id}`);
        toast.success('Document created');
      } else {
        await axios.put(`/api/documents/${id}`, { title, content });
        toast.success('Saved');
      }
    } catch (err) {
      toast.error('Save failed');
    }
    setIsSaving(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <div className="max-w-5xl mx-auto px-4">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate('/dashboard')}
               className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all"
             >
               <ChevronLeft size={20} />
             </button>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <FileText size={24} />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent text-3xl font-bold font-display border-none outline-none focus:text-primary transition-all p-0 m-0"
                />
             </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-10">
            <Save size={20} /> {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </header>

        <Card className="p-0 border-white/10 glass shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
           <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-2">
              <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/20 ml-4">MS Editor v1.0</span>
           </div>
           
           <div className="p-1">
             <ReactQuill 
               theme="snow" 
               value={content} 
               onChange={setContent}
               modules={modules}
               className="quill-editor-custom"
             />
           </div>
        </Card>
      </div>

      <style>{`
        .quill-editor-custom .ql-toolbar {
          background: rgba(255, 255, 255, 0.02);
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 16px 20px;
        }
        .quill-editor-custom .ql-container {
          border: none !important;
          min-height: 600px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
        }
        .quill-editor-custom .ql-editor {
          padding: 40px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
        }
        .quill-editor-custom .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.2);
          left: 40px;
        }
        .quill-editor-custom .ql-stroke {
          stroke: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-editor-custom .ql-fill {
          fill: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-editor-custom .ql-picker {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-editor-custom .ql-picker-options {
          background-color: #0d0d0d !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
