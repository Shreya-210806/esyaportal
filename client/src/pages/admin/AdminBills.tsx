import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, IndianRupee } from "lucide-react";

export default function AdminBills() {
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/admin/bills`);
      const data = await res.json();
      if (data.success) {
        setBills(data.bills);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Electricity Bills</h2>
          <p className="text-muted-foreground mt-1">
            System-wide generated electricity bills.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <FileText className="w-3.5 h-3.5 mr-1" />
              {bills.length} Bills
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Month</th>
                  <th className="px-6 py-4 font-medium">Consumer ID</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  bills.map((b) => (
                    <tr key={b._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{b.month || b.billNumber}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">{b.consumerNumber || "Unknown"}</td>
                      <td className="px-6 py-4 font-medium flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-1" /> {b.billAmount || b.amount}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(b.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={b.billStatus === "Paid" ? "default" : "outline"}
                          className={b.billStatus === "Paid" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}>
                          {b.billStatus || b.status}
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
