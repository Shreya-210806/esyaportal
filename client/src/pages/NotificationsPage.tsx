import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCheck, Clock, AlertTriangle, IndianRupee, Zap, Info } from 'lucide-react';

const typeIcon: Record<string, React.ReactNode> = {
  bill: <IndianRupee className="w-4 h-4" />,
  payment: <CheckCheck className="w-4 h-4" />,
  reminder: <Clock className="w-4 h-4" />,
  alert: <AlertTriangle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

const typeColor: Record<string, string> = {
  bill: 'bg-primary/10 text-primary',
  payment: 'bg-energy-green/10 text-energy-green',
  reminder: 'bg-energy-orange/10 text-energy-orange',
  alert: 'bg-destructive/10 text-destructive',
  info: 'bg-muted text-muted-foreground',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, bills, markNotificationRead, markAllRead } = useData();
  const [tab, setTab] = useState('all');
  const unread = notifications.filter((n) => !n.isRead).length;

  // If first login, show welcome message
  if (user?.isFirstLogin) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications & Reminders</h1>
            <p className="text-muted-foreground text-sm">Welcome to PortalPal! Your notifications will appear here starting from your next login.</p>
          </div>
        </div>
      </div>
    );
  }

  // Generate payment reminders from upcoming/overdue bills
  const reminders = bills
    .filter((b) => b.status === 'unpaid' || b.status === 'overdue')
    .map((b) => {
      const dueDate = new Date(b.dueDate);
      const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / 86400000);
      return {
        id: `reminder-${b.id}`,
        billNumber: b.billNumber,
        billingMonth: b.billingMonth,
        amount: b.billAmount,
        dueDate: b.dueDate,
        daysLeft,
        isOverdue: b.status === 'overdue',
      };
    });

  const filtered = tab === 'all' ? notifications :
    tab === 'unread' ? notifications.filter((n) => !n.isRead) :
    notifications.filter((n) => n.type === tab);

  const hasAny = notifications.length > 0 || reminders.length > 0;

  if (!hasAny) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications & Reminders</h1>
            <p className="text-muted-foreground text-sm">No notifications available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications & Reminders</h1>
          <p className="text-muted-foreground text-sm">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" />Mark all read
          </Button>
        )}
      </div>

      {/* Payment Reminders */}
      {reminders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-energy-orange" />
            Payment Reminders ({reminders.length})
          </h3>
          {reminders.map((r) => (
            <Card
              key={r.id}
              className={`shadow-card border ${
                r.isOverdue
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-energy-orange/30 bg-energy-orange/5"
              }`}
            >
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        r.isOverdue ? "bg-destructive/10" : "bg-energy-orange/10"
                      }`}
                    >
                      {r.isOverdue ? (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      ) : (
                        <Clock className="w-5 h-5 text-energy-orange" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.billingMonth}</p>
                      <p className="text-lg font-bold text-foreground mt-0.5">₹{r.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Due date:{" "}
                        <span className="font-semibold text-foreground">
                          {new Date(r.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {r.isOverdue ? `Overdue by ${Math.abs(r.daysLeft)} days` : `Due in ${r.daysLeft} days`}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs border shrink-0 ${
                      r.isOverdue
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-energy-orange/10 text-energy-orange border-energy-orange/30"
                    }`}
                  >
                    {r.isOverdue ? "Overdue" : "Upcoming"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notification Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="bill">Bills</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="space-y-3 mt-4">
          {filtered.length === 0 && (
            <Card className="shadow-card border-border/60">
              <CardContent className="py-12 text-center">
                <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">No notifications</p>
              </CardContent>
            </Card>
          )}
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markNotificationRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border border-border/60 transition-all cursor-pointer
                ${n.isRead ? 'bg-card opacity-70' : 'bg-accent/40 shadow-card hover:shadow-hover'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeColor[n.type]}`}>
                {typeIcon[n.type] || <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm text-foreground">{n.title}</p>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
