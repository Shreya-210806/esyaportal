import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle, MessageSquare, Star, CheckCircle2, Loader2, Check, X, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  { q: 'How do I read my electricity meter?', a: 'Your meter displays total units consumed. The difference between current and previous readings gives monthly consumption. Note the 5-digit number on the display.' },
  { q: 'What is the due date for my bill?', a: 'Bills are generated on the 1st of every month. The due date is the 15th. Late payments attract a 2% surcharge per month.' },
  { q: 'How can I report a power outage?', a: 'Call our 24×7 helpline at 1912 or submit a complaint through this portal. Our team responds within 2-4 hours for residential connections.' },
  { q: 'Can I get a tariff change?', a: 'Yes. Apply online through the portal or visit your nearest Esyasoft office with KYC documents. Processing takes 7-10 working days.' },
  { q: 'How does auto-payment work?', a: 'Enable auto-pay in your profile settings. Bills will be auto-debited from your linked account 2 days before the due date.' },
  { q: 'What documents are needed for new connection?', a: 'Identity proof (Aadhar/PAN), address proof, property ownership/rent agreement, and a passport photo. Apply online or visit our office.' },
  { q: 'How is my bill calculated?', a: 'Bill = Units × Rate + Fixed Charges + Tax. Rates vary by slab: 0-100 units @ ₹3.5, 101-300 @ ₹5.5, 301-500 @ ₹7.5, 500+ @ ₹9/unit.' },
  { q: 'What is a meter deposit?', a: 'A security deposit collected at connection time, refundable when you close the connection. It equals 3 months estimated consumption.' },
];

const requestTypes = [
  'Power Outage', 'Meter Fault', 'High Bill Complaint', 'New Connection',
  'Load Enhancement', 'Name Transfer', 'Address Change', 'Other'
];

const electricalSafety = {
  dos: [
    "Switch off power before plugging/unplugging appliances.",
    "Use good quality wiring and 3-pin plugs.",
    "Ensure proper earthing.",
    "Replace damaged switches or wires immediately.",
    "Use only ISI-certified wires and electrical equipment.",
  ],
  donts: [
    "Do not touch exposed broken wires.",
    "Do not overload sockets.",
    "Do not climb electric poles.",
    "Do not build or plant near overhead lines.",
    "Do not use electrical devices near wet floors or water.",
  ],
};

export default function SupportPage() {
  const { user } = useAuth();
  const { serviceRequests, addServiceRequest, rateService } = useData();
  const { toast } = useToast();
  const [form, setForm] = useState({ type: '', description: '', priority: 'medium' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.description) {
      toast({ title: 'Error', description: 'Please fill all fields.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    addServiceRequest({ ...form, userId: user!.id, priority: form.priority as any });
    setLoading(false);
    setSuccess(true);
    setForm({ type: '', description: '', priority: 'medium' });
    toast({ title: 'Request Submitted', description: 'We will get back to you within 24-48 hours.' });
  };

  const handleRate = (requestId: string) => {
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }
    rateService(requestId, rating, feedback);
    setRatingModal(null);
    setRating(0);
    setFeedback('');
    toast({ title: 'Thank you!', description: 'Your feedback helps us improve.' });
  };

  const statusColor: Record<string, string> = {
    open: 'bg-primary/10 text-primary border-primary/30',
    'in-progress': 'bg-energy-orange/10 text-energy-orange border-energy-orange/30',
    resolved: 'bg-energy-green/10 text-energy-green border-energy-green/30',
    closed: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground text-sm">FAQs, complaint tracking, and submit new requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: FAQ + Complaints */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ */}
          <Card className="shadow-card border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm text-left hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Electrical Safety – Do's & Don'ts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-separate border-spacing-0 rounded-xl overflow-hidden">
                  <thead>
                    <tr>
                      <th className="w-1/2 text-left p-3 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded flex items-center justify-center bg-emerald-500 text-white shrink-0">
                            <Check className="w-4 h-4" />
                          </span>
                          Do's
                        </div>
                      </th>
                      <th className="w-1/2 text-left p-3 bg-red-500/12 text-red-600 dark:text-red-400 border border-red-500/25 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded flex items-center justify-center bg-red-500 text-white shrink-0">
                            <X className="w-4 h-4" />
                          </span>
                          Don'ts
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {electricalSafety.dos.map((item, idx) => (
                      <tr key={idx}>
                        <td className="align-top p-3 border border-emerald-500/20 bg-emerald-500/5">
                          <div className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        </td>
                        <td className="align-top p-3 border border-red-500/20 bg-red-500/5">
                          <div className="flex items-start gap-2 text-sm text-foreground">
                            <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <span>{electricalSafety.donts[idx]}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* My Requests */}
          {serviceRequests.length > 0 && (
            <Card className="shadow-card border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Service Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceRequests.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl border border-border/60 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-semibold text-sm text-foreground">{r.type}</span>
                        <span className="text-xs text-muted-foreground ml-2">#{r.requestNumber}</span>
                      </div>
                      <Badge className={`text-xs capitalize border ${statusColor[r.status]}`}>{r.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{r.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <div className="flex items-center gap-2">
                        {r.rating ? (
                          <div className="flex items-center gap-1 text-xs text-energy-orange">
                            {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                          </div>
                        ) : r.status === 'resolved' ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            onClick={() => setRatingModal(r.id)}>
                            <Star className="w-3 h-3 mr-1" />Rate
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Submit Complaint */}
        <div className="space-y-4">
          <Card className="shadow-card border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Submit a Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-energy-green mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Request Submitted!</h3>
                  <p className="text-xs text-muted-foreground mb-4">We'll respond within 24-48 hours.</p>
                  <Button size="sm" onClick={() => setSuccess(false)}>Submit Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Request Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe your issue in detail..." rows={4}
                      value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : 'Submit Request'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-card border-border/60">
            <CardContent className="pt-5 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Emergency Contact</h3>
              {[
                { label: '24×7 Helpline', value: '1912', type: 'tel' },
                { label: 'Customer Care', value: '1800-XXX-XXXX', type: 'tel' },
                { label: 'Email', value: 'support@esyasoft.com', type: 'email' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating Modal */}
      <Dialog open={!!ratingModal} onOpenChange={() => setRatingModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star className={`w-8 h-8 transition-colors ${s <= rating ? 'text-energy-orange fill-current' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>
            <Textarea placeholder="Share your feedback (optional)..." rows={3}
              value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            <Button className="w-full" onClick={() => ratingModal && handleRate(ratingModal)}>Submit Rating</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
