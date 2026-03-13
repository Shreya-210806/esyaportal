import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, CheckCircle2, AlertTriangle, Smartphone, Building, Wallet } from 'lucide-react';
import type { Payment } from '@/contexts/DataContext';

const paymentMethods = [
  { id: 'UPI', label: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone },
  { id: 'Card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'Net Banking', label: 'Net Banking', desc: 'All major banks', icon: Building },
  { id: 'Wallet', label: 'Wallet', desc: 'Paytm, Mobikwik', icon: Wallet },
] as const;

export default function PayBillPage() {
  const { bills, payBill } = useData();
  const { user } = useAuth();
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [method, setMethod] = useState<Payment['method']>('UPI');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paidPayment, setPaidPayment] = useState<Payment | null>(null);

  const unpaidBills = bills.filter((b) => b.billStatus !== 'Paid').sort((a, b) => {
    const order = { overdue: 0, Pending: 1 };
    return (order[a.billStatus as keyof typeof order] ?? 2) - (order[b.billStatus as keyof typeof order] ?? 2);
  });
  const selected = bills.find((b) => b.id === selectedBillId) || unpaidBills[0];

  const { toast } = useToast();

  const handlePay = async () => {

    if (!selected) return;
    setLoading(true);
    try {
      const payment = await payBill(selected.id, method, selected.billAmount);
      setPaidPayment(payment);
      setSuccess(true);
    } catch (error: any) {
      console.error("Payment failed", error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (unpaidBills.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Pay Bill</h1>
        <Card className="shadow-card border-border/60">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-energy-green mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">All Bills Paid!</h2>
            <p className="text-muted-foreground">You have no outstanding bills. Great job! 🎉</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pay Bill</h1>
        <p className="text-muted-foreground text-sm">Select a bill and choose your payment method</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bill Selection */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="shadow-card border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Bill to Pay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unpaidBills.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => setSelectedBillId(bill.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    (selected?.id === bill.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{bill.month}</span>
                    <Badge className={bill.billStatus === 'overdue' ? 'bg-destructive/10 text-destructive border-destructive/30 border' : 'bg-energy-orange/10 text-energy-orange border-energy-orange/30 border'}>
                      {bill.billStatus === 'overdue' ? '⚠️ Overdue' : 'Unpaid'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bill: {bill.billNumber || bill.consumerNumber}</span>
                    <span className="text-xl font-bold text-foreground">₹{bill.billAmount?.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Due: {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-card border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as Payment['method'])}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map(({ id, label, desc, icon: Icon }) => (
                    <div key={id} className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${method === id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`}
                      onClick={() => setMethod(id)}>
                      <RadioGroupItem value={id} id={id} className="sr-only" />
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor={id} className="font-medium text-sm text-foreground cursor-pointer">{label}</Label>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      {method === id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <Card className="shadow-card border-border/60 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consumer</span>
                  <span className="font-medium text-foreground">{user?.consumerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consumer No.</span>
                  <span className="font-mono text-foreground">{user?.consumerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bill Month</span>
                  <span className="font-medium text-foreground">{selected?.month || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Units</span>
                  <span className="text-foreground">{selected?.unitsConsumed || '-'} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="text-foreground">{method}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-primary text-xl">₹{selected?.billAmount?.toLocaleString() || '0'}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handlePay} disabled={loading || !selected}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</> : `Pay ₹${selected?.billAmount?.toLocaleString() || 0}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">🔒 256-bit SSL encrypted payment</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Payment Successful! 🎉</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-energy-green" />
            </div>
            {paidPayment && (
              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  {[
                    ['Transaction ID', paidPayment.transactionId],
                    ['Amount Paid', `₹${paidPayment.amount.toLocaleString()}`],
                    ['Payment Method', paidPayment.method],
                    ['Date & Time', new Date(paidPayment.dateTime).toLocaleString('en-IN')],
                    ['Status', '✅ Successful'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button className="w-full" onClick={() => setSuccess(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
