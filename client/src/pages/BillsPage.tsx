import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Download, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

export default function BillsPage() {
  const { user } = useAuth();
  const { payBill } = useData();
  const { toast } = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!user?.id) return;

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
        const res = await fetch(
          `${apiUrl}/api/users/bills/${user.consumerNumber || user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setBills(data.bills);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user]);

  const handlePayBill = async (billId: string) => {
    setPayingBillId(billId);
    try {
      const bill = bills.find((b) => b._id === billId);
      if (!bill) throw new Error("Bill not found");

      await payBill(billId, "UPI", bill.billAmount);

      toast({
        title: "Payment Successful",
        description: "Your bill has been paid successfully!",
      });
      // Update bill status locally
      setBills((prev) =>
        prev.map((b) =>
          b._id === billId ? { ...b, billStatus: "Paid" } : b
        )
      );
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred while processing payment",
        variant: "destructive",
      });
    } finally {
      setPayingBillId(null);
    }
  };

  const handleDownloadBill = async (billId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/users/bills/${billId}/download?userId=${user?.id}`);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bill-${billId}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Download Started",
          description: "Your bill has been downloaded successfully!",
        });
      } else {
        toast({
          title: "Download Failed",
          description: "Failed to download bill",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading bill:", error);
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading bills...</div>;
  }

  // If first login, show welcome message
  if (user?.isFirstLogin) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Bills</h1>
        <p>Welcome to PortalPal! Your bills will appear here starting from your next login.</p>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Bills</h1>
        <p>No bills available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Bills</h1>

      <Card>
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{bill.month} Electricity Bill</h3>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(bill.dueDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{bill.billAmount}</p>
                    <Badge variant={bill.billStatus === "Paid" ? "default" : "destructive"}>
                      {bill.billStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {bill.billStatus !== "Paid" && (
                    <Button
                      onClick={() => handlePayBill(bill._id)}
                      disabled={payingBillId === bill._id}
                      className="flex items-center gap-2"
                    >
                      {payingBillId === bill._id ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {payingBillId === bill._id ? "Processing..." : "Pay Bill"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handleDownloadBill(bill._id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}