import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, IndianRupee } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/admin/payments`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>
          <p className="text-muted-foreground mt-1">
            Track user payments across the platform.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <CreditCard className="w-3.5 h-3.5 mr-1" />
              {payments.length} Payments
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Consumer No.</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Payment Mode</th>
                  <th className="px-6 py-4 font-medium">Date Applied</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No payments recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium">{p.consumerNumber}</td>
                      <td className="px-6 py-4 font-medium flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-1 text-muted-foreground" /> {p.amount}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">
                        {p.paymentMethod || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(p.paymentDate).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                         <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                          {p.status || "success"}
                        </Badge>
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
