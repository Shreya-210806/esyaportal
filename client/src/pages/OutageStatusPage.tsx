import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OutageStatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-energy-orange/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-energy-orange" />
            </div>
            <div>
              <h1 className="landing-heading text-3xl font-bold text-foreground mb-1">Outage Status</h1>
              <p className="text-sm text-muted-foreground">
                Check current and upcoming planned outages, restoration timelines, and important service updates for your area.
              </p>
            </div>
          </div>

          <Card className="landing-soft-card border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">View Detailed Outage Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Sign in to your consumer account to view location-specific outage details, SMS alerts, and restoration
                updates tailored to your registered connection.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/login">
                  <Button size="sm">Login to View Status</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

