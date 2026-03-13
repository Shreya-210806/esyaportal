import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get data from previous steps
  const personalDetails = location.state || {};

  const [idProof, setIdProof] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [otherDocument, setOtherDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    console.log(`File selected for ${fieldName}:`, file);

    if (!file) {
      setFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, JPG, or PNG files only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    console.log(`File set successfully for ${fieldName}:`, file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idProof || !addressProof) {
      toast({
        title: "Documents required",
        description: "Please upload both ID proof and address proof",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convert files to base64
      const idProofData = await fileToBase64(idProof);
      const addressProofData = await fileToBase64(addressProof);
      const otherDocumentData = otherDocument ? await fileToBase64(otherDocument) : null;

      // Submit application using FormData for better file handling
      const formData = new FormData();

      // Add personal details
      Object.keys(personalDetails).forEach(key => {
        formData.append(key, personalDetails[key]);
      });

      // Add files
      if (idProof) formData.append('idProof', idProof);
      if (addressProof) formData.append('addressProof', addressProof);
      if (otherDocument) formData.append('otherDocument', otherDocument);

      const response = await fetch("http://localhost:5000/api/users/applications", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      const result = await response.json();

      toast({
        title: "Application Submitted Successfully!",
        description: "Your consumer number will be generated within 2 minutes. You can track your application status.",
      });

      // Navigate to application tracking page
      navigate("/application-tracking");

    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleBack = () => {
    navigate("/new-connection/personal", {
      state: personalDetails
    });
  };

  const removeFile = (setFile: (file: File | null) => void) => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-gray-600">Mobile</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-gray-600">OTP</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm text-gray-600">Personal Details</span>
              </div>
              <div className="w-12 h-0.5 bg-blue-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Documents</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Upload Documents
              </CardTitle>
              <CardDescription>
                Please upload the required documents for your new connection application
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ID Proof */}
                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof * (PDF/JPG/PNG)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {!idProof ? (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <Label htmlFor="idProof" className="cursor-pointer">
                          <span className="text-sm text-gray-600">Click to upload ID proof</span>
                        </Label>
                        <input
                          id="idProof"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, setIdProof, "idProof")}
                          className="hidden"
                        />
                        {/* Fallback visible input */}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, setIdProof, "idProof")}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-gray-900">{idProof.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(setIdProof)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Proof */}
                <div className="space-y-2">
                  <Label htmlFor="addressProof">Address Proof * (PDF/JPG/PNG)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {!addressProof ? (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <Label htmlFor="addressProof" className="cursor-pointer">
                          <span className="text-sm text-gray-600">Click to upload address proof</span>
                        </Label>
                        <input
                          id="addressProof"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, setAddressProof, "addressProof")}
                          className="hidden"
                        />
                        {/* Fallback visible input */}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, setAddressProof, "addressProof")}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-gray-900">{addressProof.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(setAddressProof)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Document */}
                <div className="space-y-2">
                  <Label htmlFor="otherDocument">Other Document (Optional) (PDF/JPG/PNG)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {!otherDocument ? (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <Label htmlFor="otherDocument" className="cursor-pointer">
                          <span className="text-sm text-gray-600">Click to upload additional document</span>
                        </Label>
                        <input
                          id="otherDocument"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, setOtherDocument, "otherDocument")}
                          className="hidden"
                        />
                        {/* Fallback visible input */}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, setOtherDocument, "otherDocument")}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-gray-900">{otherDocument.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(setOtherDocument)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}