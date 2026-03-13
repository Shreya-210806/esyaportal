import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function PaymentHistoryPage() {
  const { payments } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = payments
    .filter((p) => {
      const matchFilter = filter === 'all' || p.status === filter;
      const matchSearch =
        p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        p.billNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.method.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const totalPaid = payments.filter((p) => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  if (payments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
          <p className="text-muted-foreground text-sm">No payment history available.</p>
        </div>
      </div>
    );
  }

  const statusIcon = {
    success: <CheckCircle2 className="w-4 h-4 text-energy-green" />,
    failed: <XCircle className="w-4 h-4 text-destructive" />,
    pending: <Clock className="w-4 h-4 text-energy-orange" />,
  };

  const statusBadge = {
    success: 'bg-accent text-energy-green border-energy-green/30',
    failed: 'bg-destructive/10 text-destructive border-destructive/30',
    pending: 'bg-energy-orange/10 text-energy-orange border-energy-orange/30',
  };

  const methodColor: Record<string, string> = {
    UPI: 'text-primary',
    Card: 'text-energy-teal',
    'Net Banking': 'text-energy-purple',
    Wallet: 'text-energy-orange',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground text-sm">All your transactions sorted by latest</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Transactions', value: payments.length, icon: History, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Successful', value: payments.filter((p) => p.status === 'success').length, icon: CheckCircle2, color: 'text-energy-green', bg: 'bg-energy-green/10' },
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, icon: CheckCircle2, color: 'text-energy-teal', bg: 'bg-energy-teal/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-card border-border/60">
            <CardContent className="pt-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by transaction ID, bill, method..." className="pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Successful</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="shadow-card border-border/60 overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Transactions ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Transaction ID', 'Bill Number', 'Date & Time', 'Amount', 'Method', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-foreground">{p.transactionId}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.billNumber}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(p.dateTime).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-medium ${methodColor[p.method] || 'text-foreground'}`}>{p.method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {statusIcon[p.status]}
                        <Badge className={`text-xs capitalize border ${statusBadge[p.status]}`}>
                          {p.status}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
