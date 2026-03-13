import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Home, Building, Factory, CheckCircle } from "lucide-react";
import UserLayout from "@/components/UserLayout";

export default function NewConnectionPage() {
  const { user } = useAuth();
  const { addNotification } = useData();
  const { toast } = useToast();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [connectionType, setConnectionType] = useState<string>("");
  const [consumerNumber, setConsumerNumber] = useState<string>("");
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    region: "",
    idProofType: "aadhar",
    idProofNumber: "",
    remarks: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [idProofData, setIdProofData] = useState<string | null>(null);
  const [addressProofData, setAddressProofData] = useState<string | null>(null);
  const [otherDocumentData, setOtherDocumentData] = useState<string | null>(null);

  if (!user) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setData: (v: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      setData(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setData(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!connectionType) {
      toast({
        title: "Connection type required",
        description: "Please select a connection type",
        variant: "destructive",
      });
      return;
    }

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.region) {
      toast({
        title: "Missing details",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!idProofData || !addressProofData) {
      toast({
        title: "Documents required",
        description: "Please upload both ID proof and address proof",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/api/users/${user.id}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionType,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          region: form.region,
          idProofType: form.idProofType,
          idProofNumber: form.idProofNumber,
          idProof: idProofData,
          addressProof: addressProofData,
          otherDocument: otherDocumentData,
          remarks: form.remarks,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({
          title: "Application failed",
          description: data.error || "Could not submit application. Try again.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      setConsumerNumber(data.application.consumerNumber);

      addNotification({
        userId: user.id,
        type: "info",
        title: "New Connection Application Submitted",
        message: "Your application has been submitted. Consumer number will be generated within 12 hours.",
      });

      setApplicationSubmitted(true);
      setSubmitting(false);
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not submit application. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                New Connection Application
              </h1>
              <p className="text-gray-600">
                Apply for a new electricity connection
              </p>
            </div>

            {applicationSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Application Submitted Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your application has been submitted and is being processed.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Your Consumer Number
                  </h3>
                  <p className="text-3xl font-mono font-bold text-blue-600">
                    {consumerNumber}
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    Please save this number for future reference
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    You can track your application status using the consumer number above.
                  </p>
                  <Link
                    to="/application-tracking"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Track Application Status
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Connection Type Selection */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Connection Type
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "residential", label: "Residential", icon: Home },
                      { id: "commercial", label: "Commercial", icon: Building },
                      { id: "industrial", label: "Industrial", icon: Factory },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setConnectionType(id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          connectionType === id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-2" />
                        <div className="font-medium">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Region *</Label>
                      <Select
                        value={form.region}
                        onValueChange={(value) =>
                          setForm({ ...form, region: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="north">North</SelectItem>
                          <SelectItem value="south">South</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Enter your complete address"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Document Upload
                  </h2>

                  {/* ID Proof */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      ID Proof *
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="idProofType">ID Proof Type</Label>
                        <Select
                          value={form.idProofType}
                          onValueChange={(value) =>
                            setForm({ ...form, idProofType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="voter">Voter ID</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="idProofNumber">ID Number</Label>
                        <Input
                          id="idProofNumber"
                          value={form.idProofNumber}
                          onChange={(e) =>
                            setForm({ ...form, idProofNumber: e.target.value })
                          }
                          placeholder="Enter ID number"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="idProof">Upload ID Proof</Label>
                      <Input
                        id="idProof"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, setIdProofData)}
                        required
                      />
                      {idProofData && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ File uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Proof */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Address Proof *
                    </h3>
                    <div>
                      <Label htmlFor="addressProof">Upload Address Proof</Label>
                      <Input
                        id="addressProof"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, setAddressProofData)}
                        required
                      />
                      {addressProofData && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ File uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Other Document */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Other Documents (Optional)
                    </h3>
                    <div>
                      <Label htmlFor="otherDocument">Upload Additional Document</Label>
                      <Input
                        id="otherDocument"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, setOtherDocumentData)}
                      />
                      {otherDocumentData && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ File uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h2>
                  <div>
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Textarea
                      id="remarks"
                      value={form.remarks}
                      onChange={(e) =>
                        setForm({ ...form, remarks: e.target.value })
                      }
                      placeholder="Any additional information or special requirements"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 text-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}