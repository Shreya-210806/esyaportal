import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  IndianRupee,
  FileText,
  Bell,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  consumerNumber: string;
  role: "user" | "admin";
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5001";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/users`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load users");
      }
      setUsers(
        (data.users || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          consumerNumber: u.consumerNumber,
          role: u.role === "admin" ? "admin" : "user",
        }))
      );
    } catch (err: any) {
      toast({
        title: "Error fetching users",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: "user" | "admin") => {
    try {
      const res = await fetch(`${apiUrl}/api/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update role");
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
      toast({
        title: "Role updated",
        description: `User role changed to ${role}`,
      });
    } catch (err: any) {
      toast({
        title: "Error updating role",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast({
        title: "User deleted",
        description: "The user has been removed successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting user",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const totalConsumers = users.length;
  const totalRevenue = totalConsumers * 18500;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            System overview and user management
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: totalConsumers,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Total Revenue",
            value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
            icon: IndianRupee,
            color: "text-energy-green",
            bg: "bg-energy-green/10",
          },
          {
            label: "Bills Generated",
            value: totalConsumers * 12,
            icon: FileText,
            color: "text-energy-orange",
            bg: "bg-energy-orange/10",
          },
          {
            label: "Pending Bills",
            value: totalConsumers * 2,
            icon: Bell,
            color: "text-destructive",
            bg: "bg-destructive/10",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-card border-border/60">
            <CardContent className="pt-5 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border/60 overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">User Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {[
                    "Name",
                    "Email",
                    "Consumer No.",
                    "Role",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">
                      {u.consumerNumber}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          u.role === "admin"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/30 border text-xs"
                            : "bg-energy-green/10 text-energy-green border-energy-green/30 border text-xs"
                        }
                      >
                        {u.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() =>
                          handleRoleChange(
                            u.id,
                            u.role === "admin" ? "user" : "admin"
                          )
                        }
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                No users found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
