import React, { useEffect, useState } from "react";
import { Copy, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Application = {
  id: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
    consumerNumber: string;
    id: string;
  };
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Application["user"] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/admin/applications`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      toast({
        title: "Error fetching applications",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
      duration: 2000,
    });
  };

  const updateApplicationStatus = async (userId: string, status: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/users/applications/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Status Updated",
          description: `Application is now ${status}`,
        });
        fetchApplications(); // Refresh list
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not change the application status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading applications...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Connections</h2>
          <p className="text-muted-foreground mt-1">Review and approve electricity requests.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Queue</CardTitle>
          <CardDescription>Live feed of new meter connection signups.</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No connection applications found.
            </div>
          ) : (
            <div className="rounded-md border border-primary/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Consumer Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.user?.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="text-muted-foreground">{app.user?.email}</span>
                          <span>{app.user?.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={app.status === "verified" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}
                          className={app.status === "verified" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 shadow-none border-green-500/20" : ""}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedUser(app.user)}
                          >
                            View Docs
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <span className="col-span-2">{selectedUser.name}</span>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Email:</span>
                <span className="col-span-2 flex items-center gap-2">
                  {selectedUser.email}
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(selectedUser.email)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </span>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                <span className="col-span-2">{selectedUser.phone}</span>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Consumer ID:</span>
                <span className="col-span-2">{selectedUser.consumerNumber}</span>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    updateApplicationStatus(selectedUser.id, "rejected");
                    setSelectedUser(null);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Request
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    updateApplicationStatus(selectedUser.id, "verified");
                    setSelectedUser(null);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
