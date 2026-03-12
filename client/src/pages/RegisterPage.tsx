import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";

import {
Zap,
Lock,
Eye,
EyeOff,
Phone,
User,
Loader2,
AlertCircle,
CheckCircle
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type FormState = {
fullName: string;
email: string;
consumerNumber: string;
contactNumber: string;
region: string;
password: string;
confirmPassword: string;
};

const REGIONS = [
"Thane, Maharashtra",
"Mumbai, Maharashtra",
"Pune, Maharashtra",
];

export default function RegisterPage() {

const { toast } = useToast();
const navigate = useNavigate();
const { setUser } = useAuth();

const [form, setForm] = useState<FormState>({
fullName: "",
email: "",
consumerNumber: "",
contactNumber: "",
region: "",
password: "",
confirmPassword: "",
});

const [showPass, setShowPass] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [showSuccessDialog, setShowSuccessDialog] = useState(false);
const [consumerNumber, setConsumerNumber] = useState("");

const validate = () => {

if (!form.fullName.trim()) return "Full Name is required.";

if (!form.email.trim()) return "Email is required.";

if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(form.email))
return "Enter a valid email.";

if (!form.consumerNumber.trim()) return "Consumer Number is required.";

if (!/^\d{10}$/.test(form.contactNumber))
return "Contact number must be 10 digits.";

if (!form.region) return "Region is required.";

if (form.password.length < 6)
return "Password must be at least 6 characters.";

if (form.password !== form.confirmPassword)
return "Passwords do not match.";

return "";
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

e.preventDefault();

const validationError = validate();

if (validationError) {
setError(validationError);
return;
}

setError("");
setLoading(true);

try {

const apiUrl =
import.meta.env.VITE_API_URL || "http://localhost:5001";

const res = await fetch(`${apiUrl}/api/users/register`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},

body: JSON.stringify({
name: form.fullName,
email: form.email,
password: form.password,
consumerNumber: form.consumerNumber,
contactNumber: form.contactNumber,
region: form.region,
}),
});

const data = await res.json();

if (!res.ok) {
setError(data.error || "Registration failed");
setLoading(false);
return;
}

if (data.user) {

const u = data.user;

// Create user object in the same format as AuthContext
const mongoUser = {
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  consumerNumber: u.consumerNumber,
  consumerName: u.name,
  address: u.address,
  role: u.isFirstLogin ? "new" : "user",
  consumers: [
    {
      id: u.id,
      consumerNumber: u.consumerNumber,
      consumerName: u.name,
      meterNumber: u.meterNumber,
      address: u.address,
      connectionType: "Residential",
      sanctionedLoad: "5 KW",
    },
  ],
  joinedDate: new Date().toISOString().split("T")[0],
  connectionStatus: u.isFirstLogin ? "pending" : "active",
  isFirstLogin: u.isFirstLogin,
};

/* update AuthContext user state */
setUser(mongoUser);

/* also save to localStorage for persistence */
localStorage.setItem("esyasoft_mongo_user", JSON.stringify(mongoUser));

/* set consumer number for dialog */
setConsumerNumber(u.consumerNumber);

/* show success dialog */
setShowSuccessDialog(true);

} else {
setError("Registration failed - no user data received");
}

} catch (err) {

setError("Network error. Make sure backend is running.");

}

setLoading(false);

};

const handleContinueToDashboard = () => {
setShowSuccessDialog(false);
navigate("/dashboard");
};

return (
  <>
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            Create Your Account
          </h2>
          <p className="text-muted-foreground">
            Register to access your electricity dashboard
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">

<div>
<Label>Full Name</Label>
<div className="relative">
<User className="absolute left-3 top-3 w-4 h-4" />
<Input
className="pl-10"
value={form.fullName}
onChange={(e) =>
setForm({ ...form, fullName: e.target.value })
}
/>
</div>
</div>

<div>
<Label>Consumer Number</Label>
<div className="relative">
<Zap className="absolute left-3 top-3 w-4 h-4" />
<Input
className="pl-10"
placeholder="e.g. CN-10001"
value={form.consumerNumber}
onChange={(e) =>
setForm({ ...form, consumerNumber: e.target.value })
}
/>
</div>
</div>

<div>
<Label>Email</Label>
<div className="relative">
<Zap className="absolute left-3 top-3 w-4 h-4" />
<Input
type="email"
className="pl-10"
value={form.email}
onChange={(e) =>
setForm({ ...form, email: e.target.value })
}
/>
</div>
</div>

<div>
<Label>Contact Number</Label>
<div className="relative">
<Phone className="absolute left-3 top-3 w-4 h-4" />
<Input
className="pl-10"
value={form.contactNumber}
onChange={(e) =>
setForm({ ...form, contactNumber: e.target.value })
}
/>
</div>
</div>

<div>
<Label>Select Region</Label>

<Select
value={form.region}
onValueChange={(val) =>
setForm({ ...form, region: val })
}

>

<SelectTrigger>
<SelectValue placeholder="Choose region" />
</SelectTrigger>

<SelectContent>
{REGIONS.map((r) => (
<SelectItem key={r} value={r}>
{r}
</SelectItem>
))}
</SelectContent>

</Select>

</div>

<div>
<Label>Password</Label>
<div className="relative">

<Lock className="absolute left-3 top-3 w-4 h-4" />

<Input
type={showPass ? "text" : "password"}
className="pl-10 pr-10"
value={form.password}
onChange={(e) =>
setForm({ ...form, password: e.target.value })
}
/>

<button
type="button"
onClick={() => setShowPass(!showPass)}
className="absolute right-3 top-3"

>

{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}

</button>

</div>
</div>

<div>
<Label>Confirm Password</Label>
<div className="relative">

<Lock className="absolute left-3 top-3 w-4 h-4" />

<Input
type={showConfirm ? "text" : "password"}
className="pl-10 pr-10"
value={form.confirmPassword}
onChange={(e) =>
setForm({
...form,
confirmPassword: e.target.value,
})
}
/>

<button
type="button"
onClick={() => setShowConfirm(!showConfirm)}
className="absolute right-3 top-3"

>

{showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}

</button>

</div>
</div>

{error && (

<div className="flex text-red-500 text-sm gap-2">
<AlertCircle className="w-4 h-4"/>
{error}
</div>
)}

<Button type="submit" className="w-full" disabled={loading}>

{loading ? (
<> <Loader2 className="w-4 h-4 animate-spin mr-2"/>
Creating Account...
</>
) : (
"Sign Up"
)}

</Button>

</form>

<p className="text-center text-sm mt-4">

Already registered?{" "}

<Link to="/login" className="text-blue-500 hover:underline">
Sign in
</Link>

</p>

</CardContent>

</Card>

</div>

{/* Success Dialog */}
<Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <div className="flex items-center justify-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <DialogTitle className="text-center text-xl">
        Registration Successful!
      </DialogTitle>
    </DialogHeader>
    <div className="text-center py-4">
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <p className="text-2xl font-bold text-gray-800 font-mono">
          {consumerNumber}
        </p>
        <p className="text-sm text-gray-600 mt-1">Consumer Number</p>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Please save this number for future reference. You will be redirected to your dashboard.
      </p>
      <Button onClick={handleContinueToDashboard} className="w-full">
        Continue to Dashboard
      </Button>
    </div>
  </DialogContent>
</Dialog>

</div>

  </>
);

}
