import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, UserPlus } from 'lucide-react';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
    isActive
      ? 'bg-accent text-foreground'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
  ].join(' ');

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Esyasoft</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/login" className={navLinkClass}>
            Pay Bill
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/application-tracking" className={navLinkClass}>
            Track Application
          </NavLink>
          <NavLink to="/complaints" className={navLinkClass}>
            Complaints
          </NavLink>
          <NavLink to="/outage-status" className={navLinkClass}>
            Outage Status
          </NavLink>
          <NavLink to="/contact-us" className={navLinkClass}>
            Contact Us
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="sm">
              Register
            </Button>
          </Link>
          <Link to="/new-connection/residential">
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-[hsl(225,78%,38%)] via-[hsl(230,78%,44%)] to-[hsl(191,100%,42%)] text-white hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              Apply for New Connection
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

