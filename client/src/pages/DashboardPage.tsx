import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Zap, IndianRupee, Calendar, Bell,
  ArrowRight, CheckCircle, Clock, Lightbulb
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import NewConnectionPage from './NewConnectionPage';

export default function DashboardPage() {
  const { user } = useAuth();
  const { bills, consumption, notifications } = useData();

  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);

  useEffect(() => {
    if (!user) return;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    fetch(`${apiUrl}/api/users/applications/user/${user.id}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.success && data.application?.status) {
          setApplicationStatus(data.application.status);
        }
        return null;
      })
      .catch(() => null);
  }, [user?.id]);

  // If new user or first login, show welcome message instead of billing dashboard
  if (user?.connectionStatus === 'pending' || user?.role === 'new' || user?.isFirstLogin) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to PortalPal, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Your account has been set up successfully. Your bills and notifications will appear here starting from your next login.
          </p>
          {applicationStatus && (
            <div className="mt-2">
              <span className="text-sm font-semibold">New Connection Status: </span>
              <span className="text-sm">
                {applicationStatus === 'pending' && 'Pending'}
                {applicationStatus === 'verified' && 'Verified'}
                {applicationStatus === 'rejected' && 'Rejected'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentBill = bills.find((b) => b.billStatus === 'Pending' || b.billStatus === 'overdue');
  const lastPaidBill = bills.filter((b) => b.billStatus === 'Paid').slice(-1)[0];
  const totalUnits = bills.slice(-3).reduce((sum, b) => sum + (b.unitsConsumed || 0), 0);
  const unpaidBills = bills.filter((b) => b.billStatus !== 'Paid');
  const recentConsumption = consumption.slice(-6);

  const tips = [
    'Use LED bulbs — they consume 75% less energy than incandescent bulbs.',
    'Set your AC to 24°C — every degree lower increases consumption by 6%.',
    'Unplug chargers when not in use — they draw power even when idle.',
    'Use natural light during the day to reduce electricity consumption.',
    'Schedule heavy appliances like washing machines for off-peak hours.',
  ];
  const tip = tips[new Date().getDate() % tips.length];

  const stats = [
    {
      label: 'Current Bill',
      value: currentBill ? `₹${currentBill.billAmount?.toLocaleString() || 0}` : 'No pending bill',
      sub: currentBill ? `Due: ${new Date(currentBill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'All bills paid',
      icon: IndianRupee,
      color: 'text-energy-orange',
      bg: 'bg-energy-orange/10',
      status: currentBill?.billStatus,
    },
    {
      label: 'Units (Last 3 Months)',
      value: `${totalUnits.toLocaleString()} kWh`,
      sub: 'Combined consumption',
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Consumer No.',
      value: user?.consumerNumber,
      sub: user?.consumerName,
      icon: CheckCircle,
      color: 'text-energy-green',
      bg: 'bg-energy-green/10',
    },
    {
      label: 'Last Payment',
      value: lastPaidBill ? `₹${lastPaidBill.paidAmount?.toLocaleString() || lastPaidBill.billAmount?.toLocaleString() || 0}` : 'N/A',
      sub: lastPaidBill?.month || '-',
      icon: Calendar,
      color: 'text-energy-teal',
      bg: 'bg-energy-teal/10',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-medium text-foreground mb-1">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: {p.name === 'amount' ? `₹${p.value}` : `${p.value} kWh`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {(() => {
              const hour = new Date().getHours();
              const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
              return `${greeting}, ${user?.name?.split(' ')[0]}! 👋`;
            })()}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's your energy overview for today
          </p>
        </div>
        {currentBill && (
          <Button asChild size="sm" className="shrink-0">
            <Link to="/pay-bill">
              Pay Now <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg, status }) => (
          <Card key={label} className="shadow-card hover:shadow-hover transition-shadow border-border/60">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {status === 'Pending' && <Badge className="text-xs bg-energy-orange/20 text-energy-orange border-energy-orange/30 hover:bg-energy-orange/20">Pending</Badge>}
              </div>
              <div className="text-xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Usage Chart */}
        <Card className="lg:col-span-2 shadow-card border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Energy Consumption Trend</CardTitle>
              <Badge variant="secondary" className="text-xs">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={recentConsumption} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(214,90%,42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(214,90%,42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="units" name="units" stroke="hsl(214,90%,42%)" fill="url(#colorUnits)" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'View Current Bill', href: '/bills', icon: FileTextIcon, color: 'text-primary' },
              { label: 'Pay Bill', href: '/pay-bill', icon: PayIcon, color: 'text-energy-green' },
              { label: 'Download Invoice', href: '/bills', icon: DownloadIcon, color: 'text-energy-teal' },
              { label: 'Raise Complaint', href: '/support', icon: SupportIcon, color: 'text-energy-orange' },
              { label: 'Energy Tips', href: '/consumption', icon: TipIcon, color: 'text-energy-purple' },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                to={href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-foreground flex-1">{label}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Notifications */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Notifications</CardTitle>
              <Link to="/notifications" className="text-xs text-primary hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg ${n.isRead ? 'opacity-70' : 'bg-accent'}`}>
                <Bell className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Energy Saving Tip */}
        <Card className="shadow-card border-border/60 bg-gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-energy-orange" />
              Energy Saving Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tip}</p>
            <div className="space-y-2">
              <div className="text-xs font-medium text-foreground mb-2">Monthly Savings Potential</div>
              {[
                { label: 'Switch to LED', saving: '₹320/mo', pct: 75 },
                { label: 'AC Optimization', saving: '₹450/mo', pct: 85 },
                { label: 'Off-peak usage', saving: '₹180/mo', pct: 45 },
              ].map(({ label, saving, pct }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-28 shrink-0">{label}</span>
                  <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-energy-green rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-energy-green font-medium w-16 text-right">{saving}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Icon helpers
const FileTextIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const PayIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const DownloadIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SupportIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const TipIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
