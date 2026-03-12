import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminConsumers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchConsumers();
  }, []);

  const fetchConsumers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/admin/consumers`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveUser = async (id: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      await fetch(`${apiUrl}/api/admin/approve/${id}`, { method: "PUT" });
      toast({ title: "User Approved", description: "The consumer has been approved."});
      fetchConsumers();
    } catch (error) {
      toast({ title: "Error", description: "Could not approve user.", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.consumerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Consumers</h2>
          <p className="text-muted-foreground mt-1">
            Manage all registered portal users.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or CN..."
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="w-3.5 h-3.5 mr-1" />
              {filteredUsers.length} Users
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Consumer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Consumer No.</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No consumers found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{u.contactNumber}</td>
                      <td className="px-6 py-4 font-mono">{u.consumerNumber}</td>
                      <td className="px-6 py-4">
                        <Badge variant={u.applicationStatus === "approved" ? "default" : "outline"}
                          className={u.applicationStatus === "approved" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}>
                          {u.applicationStatus || "pending"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.applicationStatus !== "approved" && (
                          <Button size="sm" variant="outline" onClick={() => approveUser(u._id)} className="h-8 gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
