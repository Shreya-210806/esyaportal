import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Clock } from "lucide-react";

export default function OtpVerificationPage() {
  const { state } = useLocation();
  const mobile = state?.mobile;
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const { toast } = useToast();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    if (!mobile) {
      navigate("/mobile-verification");
      return;
    }

    // Start countdown timer for resend
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mobile, navigate]);

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mobile, otp })
      });

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Invalid OTP",
          description: data.error || "Please enter correct OTP",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Verified",
        description: "Mobile number verified successfully"
      });

      // Store verified mobile in sessionStorage for the next steps
      sessionStorage.setItem("verifiedMobile", mobile);

      // Navigate to personal details page
      navigate("/new-connection/personal");
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not verify OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;

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
          title: "OTP Resent",
          description: "New OTP sent to your mobile"
        });
        // demo: display the OTP in a toast as well
        toast({
          title: "Demo OTP",
          description: data.otp,
        });
        setResendTimer(30);
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Could not resend OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not resend OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!mobile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/mobile-verification")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-900">New Connection</h1>
            <p className="text-sm text-gray-600">Step 1 of 3: OTP Verification</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-0.5 bg-blue-600"></div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
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
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Enter Verification Code</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              We've sent a 6-digit code to <strong>{mobile}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">
                Enter the code sent to your mobile number
              </p>
            </div>

            <Button
              onClick={verifyOtp}
              className="w-full h-12 text-base font-medium"
              disabled={otp.length < 4}
            >
              Verify & Continue
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={resendOtp}
                disabled={resendTimer > 0}
                className="text-blue-600 hover:text-blue-700"
              >
                {resendTimer > 0 ? (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Resend in {resendTimer}s
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}