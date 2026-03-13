import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap, FileText, BarChart3, ClipboardList, CreditCard,
  User, Phone, Mail, MapPin,
  ArrowRight, Shield, Clock, Award, Leaf, Users, CheckCircle2, Gauge, Sparkles
} from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';

const SERVICE_CARDS = [
  {
    icon: CreditCard,
    title: 'Pay Bill Instantly',
    desc: 'Quick and secure online bill payment with multiple payment options.',
    action: 'Pay Now',
    link: '/pay-bill',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: FileText,
    title: 'Download Bill / Statement',
    desc: 'Access and download your electricity bills and account statements anytime.',
    action: 'View Statement',
    link: '/bills',
    color: 'text-[hsl(var(--energy-teal))]',
    bg: 'bg-[hsl(var(--energy-teal)/0.1)]',
  },
  {
    icon: BarChart3,
    title: 'Track Energy Usage',
    desc: 'Monitor your electricity consumption patterns with detailed analytics.',
    action: 'View Usage',
    link: '/consumption',
    color: 'text-[hsl(var(--energy-orange))]',
    bg: 'bg-[hsl(var(--energy-orange)/0.1)]',
  },
  {
    icon: ClipboardList,
    title: 'Apply for Services',
    desc: 'Request new connections, load changes, name transfers and more.',
    action: 'Apply Now',
    link: '/support',
    color: 'text-[hsl(var(--energy-purple))]',
    bg: 'bg-[hsl(var(--energy-purple)/0.1)]',
  },
];

const ONLINE_SERVICES = [
  { icon: Zap, label: 'Electricity Connection', link: '/new-connection/residential' },
];

export default function LandingPage() {
  return (
    <div id="home" className="landing-shell min-h-screen bg-background flex flex-col">
      <PublicHeader />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-[8%] w-44 h-44 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-8 right-[10%] w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="w-full px-3 md:px-6 py-10 lg:py-14">
          <div className="space-y-8">
              <div className="landing-sky-panel hero-glow relative rounded-3xl overflow-hidden px-8 py-12 md:px-14 md:py-16 text-white shadow-hover">
                <div className="absolute inset-0 opacity-15"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '36px 36px' }}
                />
                <div className="absolute top-10 right-12 w-24 h-24 rounded-full border border-white/20 bg-white/10 animate-pulse" />
                <div className="absolute bottom-8 right-28 w-14 h-14 rounded-full border border-white/25 bg-white/10 animate-pulse [animation-delay:700ms]" />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <div>
                    <p className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide mb-5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Smart Electricity Portal
                    </p>
                    <h1 className="landing-heading text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.03] mb-5 tracking-tight max-w-4xl">
                      Welcome to <span className="text-cyan-200">Esyasoft</span> –<br />
                      Powering Smarter Homes
                    </h1>
                    <p className="text-white/90 text-lg md:text-2xl max-w-2xl mb-9 leading-relaxed">
                      A smart digital energy platform to manage your electricity services securely — pay bills, track usage, and apply for services online.
                    </p>
                    <div className="mb-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link to="/login">
                          <Button
                            size="lg"
                            className="rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all font-semibold"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link to="/register">
                          <Button
                            size="lg"
                            className="rounded-xl bg-gradient-to-r from-[hsl(225,78%,38%)] via-[hsl(230,78%,44%)] to-[hsl(191,100%,42%)] text-white shadow-lg shadow-black/25 hover:brightness-110 hover:-translate-y-0.5 transition-all font-semibold"
                          >
                            Register
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="landing-chip flex items-center gap-2 backdrop-blur rounded-full px-4 py-2 text-sm shadow-sm">
                        <Shield className="w-4 h-4" /> Secure & Reliable
                      </div>
                      <div className="landing-chip flex items-center gap-2 backdrop-blur rounded-full px-4 py-2 text-sm shadow-sm">
                        <Clock className="w-4 h-4" /> 24/7 Available
                      </div>
                      <div className="landing-chip flex items-center gap-2 backdrop-blur rounded-full px-4 py-2 text-sm shadow-sm">
                        <Zap className="w-4 h-4" /> Instant Payments
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="landing-showcase rounded-2xl p-4 text-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Live Consumption Analytics</p>
                        <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-1">Today</span>
                      </div>
                      <div className="rounded-xl bg-white/90 p-4 border border-blue-100">
                        <div className="flex items-end gap-2 h-20 mb-3">
                          <div className="w-6 rounded-t-md bg-blue-200 h-8" />
                          <div className="w-6 rounded-t-md bg-blue-300 h-12" />
                          <div className="w-6 rounded-t-md bg-blue-400 h-9" />
                          <div className="w-6 rounded-t-md bg-blue-500 h-16" />
                          <div className="w-6 rounded-t-md bg-indigo-500 h-14" />
                          <div className="w-6 rounded-t-md bg-cyan-500 h-20" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-medium">Projected Bill</p>
                          <p className="font-bold text-lg">Rs. 2,310</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="landing-floating-card rounded-lg p-3">
                          <p className="text-xs text-slate-600 mb-1">Power Health</p>
                          <p className="text-sm font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stable</p>
                        </div>
                        <div className="landing-floating-card rounded-lg p-3">
                          <p className="text-xs text-slate-600 mb-1">Usage Trend</p>
                          <p className="text-sm font-semibold flex items-center gap-1"><Gauge className="w-4 h-4 text-blue-700" /> Efficient</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="landing-glass hover:-translate-y-0.5 transition-all duration-200">
                  <CardContent className="p-5 flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xl font-bold text-foreground">2.4M+</p>
                      <p className="text-sm text-muted-foreground">Consumers Served</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="landing-glass hover:-translate-y-0.5 transition-all duration-200">
                  <CardContent className="p-5 flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-energy-green mt-0.5" />
                    <div>
                      <p className="text-xl font-bold text-foreground">30%</p>
                      <p className="text-sm text-muted-foreground">Renewable Energy Mix</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="landing-glass hover:-translate-y-0.5 transition-all duration-200">
                  <CardContent className="p-5 flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xl font-bold text-foreground">99.9%</p>
                      <p className="text-sm text-muted-foreground">Service Uptime</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="landing-why-panel rounded-3xl px-5 py-8 md:px-8 md:py-10 space-y-5">
                <div className="text-center">
                  <h2 className="landing-heading text-2xl md:text-3xl font-bold text-foreground">Why Consumers Choose Us</h2>
                  <p className="landing-subtext text-muted-foreground mt-1 mx-auto">Reduce service effort and improve convenience with transparent billing and fast digital support.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="landing-soft-card hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                        <CreditCard className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Pay Bill Instantly</h3>
                      <p className="text-sm text-muted-foreground">Pay online in seconds with secure channels and multiple payment options.</p>
                    </CardContent>
                  </Card>
                  <Card className="landing-soft-card hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                        <Shield className="w-5 h-5 text-blue-700" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Trusted & Safe</h3>
                      <p className="text-sm text-muted-foreground">Trusted by over 2.4 million consumers with robust account protection.</p>
                    </CardContent>
                  </Card>
                  <Card className="landing-soft-card hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Sustainable Future</h3>
                      <p className="text-sm text-muted-foreground">Eco-conscious operations and a stronger renewable energy roadmap.</p>
                    </CardContent>
                  </Card>
                  <Card className="landing-soft-card hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5 text-cyan-700" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">Download Statements</h3>
                      <p className="text-sm text-muted-foreground">Access bills, receipts, and payment history anytime from one place.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Service Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {SERVICE_CARDS.map((card) => (
                  <Card key={card.title} className="landing-soft-card group hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 border-border/60">
                    <CardContent className="p-5">
                      <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{card.desc}</p>
                      <Link to={card.link}>
                        <Button variant="outline" size="sm" className="gap-1.5 group-hover:border-primary group-hover:text-primary transition-colors">
                          {card.action} <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* ── Applications Available Online ── */}
      <section id="services" className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="landing-heading text-2xl font-bold text-foreground text-center mb-2">Applications <span className="landing-accent-text">Available Online</span></h2>
          <p className="text-muted-foreground text-center mb-8">Submit your service requests digitally — fast, paperless, and trackable.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ONLINE_SERVICES.map((svc) => (
              <Link key={svc.label} to={svc.link}>
                <Card className="landing-soft-card group hover:shadow-hover hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <svc.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{svc.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Help & Outage Section ── */}
      <section className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          <Card id="complaints" className="landing-soft-card shadow-card border-border/70">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Complaints</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Register and track complaints quickly through the consumer portal support center.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">Go to Complaints</Button>
              </Link>
            </CardContent>
          </Card>

          <Card id="outage-status" className="landing-soft-card shadow-card border-border/70">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Outage Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check outage updates and latest service restoration notices for your area.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">Check Outage Status</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact-us" className="border-t border-border bg-card/95 py-8">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-foreground">Esyasoft</span>
              </div>
              <p className="text-sm text-muted-foreground">Empowering consumers with smart energy management solutions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-primary transition-colors">Consumer Login</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">New Connection</Link></li>
                <li><Link to="/support" className="hover:text-primary transition-colors">Complaints</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 1800-XXX-XXXX (Toll Free)</li>
                <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> support@esyasoft.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Bengaluru, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Esyasoft Electricity Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
