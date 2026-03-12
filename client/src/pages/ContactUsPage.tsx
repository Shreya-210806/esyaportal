import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <section className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="landing-heading text-3xl font-bold text-foreground mb-1">Contact Us</h1>
            <p className="text-sm text-muted-foreground">
              Reach out to Esyasoft for billing queries, technical support, new connections, or general information.
            </p>
          </div>

          <Card className="landing-soft-card border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Consumer Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-medium text-foreground">1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="font-medium text-foreground">support@esyasoft.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium text-foreground">Bengaluru, India</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Our consumer care team is available 24×7 for supply-related emergencies and during working hours for
                billing and service queries.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

