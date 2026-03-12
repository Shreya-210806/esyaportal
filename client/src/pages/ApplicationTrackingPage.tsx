import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Search,
  Loader2
} from "lucide-react";
import PublicHeader from "@/components/PublicHeader";

export default function ApplicationTrackingPage() {
  const { toast } = useToast();
  const [mobile, setMobile] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const fetchApplication = async () => {
    if (!mobile || mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setApplication(null);

    try {
      const res = await fetch(`${apiUrl}/api/users/application-status/${mobile}`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch application status");
      }

      const data = await res.json();
      setApplication(data.application);

      toast({
        title: "Application found",
        description: "Application status retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch application status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Your application is under review. We will notify you once it's processed.";
      case "verified":
        return "Your application has been approved! Your consumer number will be sent via SMS.";
      case "rejected":
        return "Your application was not approved. Please contact support for more details.";
      default:
        return "Application status unknown.";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Track Your Application
              </CardTitle>
              <CardDescription>
                Enter your mobile number to check the status of your new electricity connection application
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        maxLength={10}
                      />
                    </div>
                    <Button onClick={fetchApplication} disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {application && (
                  <Card className="mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Application Details</CardTitle>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-600">Application ID</p>
                            <p className="text-gray-900 font-mono">{application.id}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-600">Mobile Number</p>
                            <p className="text-gray-900">{mobile}</p>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <p className="font-medium text-gray-600">Applicant Name</p>
                          <p className="text-gray-900">{application.name}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Submitted On</p>
                          <p className="text-gray-900">{formatDate(application.createdAt)}</p>
                        </div>

                        {application.consumerNumber && (
                          <div>
                            <p className="font-medium text-gray-600">Consumer Number</p>
                            <p className="text-gray-900 font-mono">{application.consumerNumber}</p>
                          </div>
                        )}

                        {application.approvedAt && (
                          <div>
                            <p className="font-medium text-gray-600">Approved On</p>
                            <p className="text-gray-900">{formatDate(application.approvedAt)}</p>
                          </div>
                        )}

                        {application.rejectedAt && (
                          <div>
                            <p className="font-medium text-gray-600">Rejected On</p>
                            <p className="text-gray-900">{formatDate(application.rejectedAt)}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{getStatusMessage(application.status)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}