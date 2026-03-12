import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Zap, IndianRupee, FileText, ArrowUpRight, Activity as ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";

type Stats = {
  totalConsumers: number;
  totalMasterRecords: number;
  totalRevenue: number;
  pendingBillsCount: number;
};

type Activity = {
  _id: string;
  title: string;
  description: string;
  type: "user" | "payment" | "bill" | "system";
  consumerNumber: string;
  timestamp: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    fetchStats();
    fetchActivities();

    const socket = io(apiUrl);

    socket.on("new-activity", (newActivity: Activity) => {
      setActivities((prev) => [newActivity, ...prev]);
      // Optional: Refetch stats whenever there's activity so numbers stay fresh
      fetchStats();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      toast({
        title: "Error fetching stats",
        description: "Make sure the backend is running.",
        variant: "destructive"
      });
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/activities`);
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch past activities");
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user": return "text-blue-500 bg-blue-500/10";
      case "payment": return "text-green-500 bg-green-500/10";
      case "bill": return "text-orange-500 bg-orange-500/10";
      default: return "text-violet-500 bg-violet-500/10";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Monitor portal health, consumers, and billing statistics.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Consumers</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalConsumers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From successful payments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <FileText className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingBillsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting consumer payment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Master Data Records</CardTitle>
            <Zap className="w-4 h-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMasterRecords || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Whitelisted entries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link to="/admin/import">
              <div className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Import Master Data</h3>
                    <p className="text-sm text-muted-foreground">Upload CSV or JSON array</p>
                  </div>
                </div>
                <ArrowUpRight className="absolute right-4 top-4 w-5 h-5 text-muted-foreground opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
              </div>
            </Link>

            <Link to="/admin/consumers">
              <div className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Manage Consumers</h3>
                    <p className="text-sm text-muted-foreground">View and approve users</p>
                  </div>
                </div>
                <ArrowUpRight className="absolute right-4 top-4 w-5 h-5 text-muted-foreground opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Real-Time Activity Feed */}
        <Card className="col-span-1 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-primary animate-pulse" />
              <CardTitle>Live Activity</CardTitle>
            </div>
            <CardDescription>Real-time platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div 
                    key={activity._id || index}
                    className="flex items-start gap-3 text-sm animate-in slide-in-from-left-4 fade-in duration-300"
                  >
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.type === 'user' ? 'bg-blue-500' : 
                      activity.type === 'payment' ? 'bg-green-500' : 
                      'bg-orange-500'
                    }`} />
                    <div>
                      <p className="font-medium leading-none">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                      <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
