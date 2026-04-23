import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border pt-20 pb-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-3xl font-display font-bold text-foreground mb-6 block">
            Elesquad
          </Link>
          <p className="text-foreground/60 mb-8 max-w-sm leading-relaxed">
            We build high-end digital experiences that help brands grow in the modern world.
            Innovative design meets cutting-edge technology.
          </p>
          <div className="flex gap-4">
            {[Globe, Mail, Globe, Globe].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-primary transition-colors text-foreground">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-display font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-foreground/60 text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/projects" className="hover:text-primary transition-colors">Our Projects</Link></li>
            <li><Link to="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
            <li><Link to="/auth" className="hover:text-primary transition-colors">Member Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-display font-semibold mb-6">Collaborate</h4>
          <p className="text-foreground/60 text-sm leading-relaxed mb-6">
            Ready to push the boundaries of digital innovation? Join our elite squad of developers.
          </p>
          <Link to="/auth">
            <button className="px-6 py-2 bg-surface border border-border rounded-lg text-xs font-bold hover:bg-primary hover:border-primary transition-all text-foreground">
              Join The Squad
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 pt-8 border-t border-border flex flex-col md:row justify-between items-center gap-4 text-foreground/40 text-sm">
        <p>© {new Date().getFullYear()} Elesquad. All rights reserved.</p>
        <Link to="/admin" className="hover:text-foreground transition-colors">Admin Access</Link>
      </div>

      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
    </footer>
  );
}
