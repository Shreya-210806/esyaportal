import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, Zap, IndianRupee, Lightbulb } from 'lucide-react';

export default function ConsumptionPage() {
  const { consumption, bills } = useData();

  const avg = consumption.length > 0
    ? Math.round(consumption.reduce((s, c) => s + c.units, 0) / consumption.length)
    : 0;

  const lastMonth = consumption[consumption.length - 1];
  const prevMonth = consumption[consumption.length - 2];
  const trend = lastMonth && prevMonth
    ? ((lastMonth.units - prevMonth.units) / prevMonth.units) * 100
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill || p.stroke }} />
              <span className="text-muted-foreground">{p.name}:</span>
              <span className="font-medium text-foreground">
                {p.name === 'Amount' ? `₹${p.value.toLocaleString()}` : `${p.value} kWh`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const tips = [
    { title: 'Switch to LED Bulbs', saving: '₹320/mo', icon: '💡', desc: 'LED bulbs use 75% less electricity' },
    { title: 'Optimize AC Usage', saving: '₹450/mo', icon: '❄️', desc: 'Set AC to 24°C to save energy' },
    { title: 'Solar Panel Installation', saving: '₹2,100/mo', icon: '☀️', desc: 'Offset 80% of electricity bills' },
    { title: 'Off-Peak Appliance Use', saving: '₹180/mo', icon: '⏰', desc: 'Run heavy appliances in off-peak hours' },
    { title: 'Smart Power Strips', saving: '₹120/mo', icon: '🔌', desc: 'Eliminate standby power waste' },
    { title: 'Energy Audit', saving: '₹600/mo', icon: '📊', desc: 'Identify high-consumption appliances' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consumption Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your energy usage patterns and insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Monthly', value: `${avg} kWh`, icon: Zap, color: 'text-primary', bg: 'bg-primary/10', sub: 'Per month average' },
          { label: 'Total Units', value: `${consumption.reduce((s, c) => s + c.units, 0).toLocaleString()} kWh`, icon: Zap, color: 'text-energy-teal', bg: 'bg-energy-teal/10', sub: 'All time' },
          { label: 'Total Spend', value: `₹${consumption.reduce((s, c) => s + c.amount, 0).toLocaleString()}`, icon: IndianRupee, color: 'text-energy-orange', bg: 'bg-energy-orange/10', sub: 'All time' },
          {
            label: 'Monthly Trend',
            value: `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`,
            icon: trend >= 0 ? TrendingUp : TrendingDown,
            color: trend >= 0 ? 'text-destructive' : 'text-energy-green',
            bg: trend >= 0 ? 'bg-destructive/10' : 'bg-energy-green/10',
            sub: 'vs previous month'
          },
        ].map(({ label, value, icon: Icon, color, bg, sub }) => (
          <Card key={label} className="shadow-card border-border/60">
            <CardContent className="pt-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              <div className="text-xs text-muted-foreground/60">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Units Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={consumption} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="units" name="Units" fill="hsl(214,90%,42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bill Amount Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={consumption} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(25,95%,55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(25,95%,55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" name="Amount" stroke="hsl(25,95%,55%)" fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Month', 'Units (kWh)', 'Bill Amount', 'vs Avg', 'Usage Bar'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...consumption].reverse().slice(0, 6).map((c) => {
                  const diff = ((c.units - avg) / avg) * 100;
                  const barPct = Math.min((c.units / (avg * 2)) * 100, 100);
                  return (
                    <tr key={c.month} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{c.month}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{c.units}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">₹{c.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${diff > 0 ? 'text-destructive' : 'text-energy-green'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 w-32">
                        <div className="bg-muted rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full ${diff > 20 ? 'bg-destructive' : diff > 0 ? 'bg-energy-orange' : 'bg-energy-green'}`}
                            style={{ width: `${barPct}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Energy Saving Tips */}
      <Card className="shadow-card border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-energy-orange" />
            Energy Saving Tips & Savings Potential
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tips.map(({ title, saving, icon, desc }) => (
              <div key={title} className="p-4 rounded-xl border border-border/60 hover:bg-accent/50 transition-colors">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-semibold text-foreground text-sm mb-1">{title}</div>
                <div className="text-xs text-muted-foreground mb-2">{desc}</div>
                <Badge className="bg-energy-green/10 text-energy-green border-energy-green/30 border text-xs">
                  Save {saving}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
