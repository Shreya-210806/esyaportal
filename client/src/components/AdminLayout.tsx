import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Zap, LayoutDashboard, Users, LogOut, Sun, Moon, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Consumers', href: '/admin/consumers', icon: Users },
    { label: 'Connection Requests', href: '/admin/applications', icon: Users },
    { label: 'Electricity Bills', href: '/admin/bills', icon: Zap },
    { label: 'Payments', href: '/admin/payments', icon: Zap },
    { label: 'Import data', href: '/admin/import', icon: Zap },
  ];

  return (
    <div className="portal-shell flex h-screen bg-background overflow-hidden">
      <aside className="portal-sidebar w-56 text-sidebar-foreground flex flex-col shrink-0 border-r border-sidebar-border/80 shadow-2xl shadow-black/25">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground text-sm">Esyasoft</div>
            <div className="text-xs text-sidebar-foreground/50">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${location.pathname === href ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25' : 'text-sidebar-foreground/75 hover:bg-sidebar-accent'}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-sidebar-border">
          <button onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/65 hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="portal-topbar h-16 flex items-center px-4 md:px-6 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />Admin Mode
          </div>
          <div className="flex-1" />
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>
        <main className="portal-content flex-1 overflow-y-auto p-7 scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}
