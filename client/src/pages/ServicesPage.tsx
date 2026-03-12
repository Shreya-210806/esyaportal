import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, FileText, BarChart3, ClipboardList } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <section className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="landing-heading text-3xl font-bold text-foreground mb-2">Services</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Access key consumer services including online bill payment, bill download, usage tracking,
              and service applications from a single, unified portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="landing-soft-card border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Pay &amp; View Bills
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Securely view, download, and pay electricity bills using multiple digital payment options.</p>
              </CardContent>
            </Card>

            <Card className="landing-soft-card border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Statements &amp; History
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Easily access past bills, payment receipts, and account statements for reconciliation.</p>
              </CardContent>
            </Card>

            <Card className="landing-soft-card border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Usage Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Monitor month-on-month energy consumption trends and identify opportunities to save.</p>
              </CardContent>
            </Card>

            <Card className="landing-soft-card border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Service Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Submit online requests for new connections and other services through the support section.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

