import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";

export default function MobileVerificationPage() {
  const [mobile, setMobile] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      toast({
        title: "Invalid Number",
        description: "Enter valid 10 digit mobile number",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/users/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mobile })
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          title: "OTP Sent",
          description: "OTP sent to your mobile"
        });
        // demo: display the OTP in a toast as well
        toast({
          title: "Demo OTP",
          description: data.otp,
        });
        navigate("/otp-verification", { state: { mobile } });
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Could not send OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not send OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/residential-connection")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-900">New Connection</h1>
            <p className="text-sm text-gray-600">Step 1 of 3: Mobile Verification</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Verify Your Mobile Number</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              We'll send an OTP to verify your mobile number for the new connection application.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium">
                Mobile Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter 10 digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="text-center text-lg tracking-wider"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 text-center">
                Enter your 10-digit mobile number without country code
              </p>
            </div>

            <Button
              onClick={sendOtp}
              className="w-full h-12 text-base font-medium"
              disabled={mobile.length !== 10}
            >
              Send OTP
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to receive SMS for verification
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}