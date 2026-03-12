import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComplaintsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="landing-heading text-3xl font-bold text-foreground mb-1">Complaints</h1>
              <p className="text-sm text-muted-foreground">
                Register supply interruptions, billing issues, meter problems, and track the status of your complaints online.
              </p>
            </div>
          </div>

          <Card className="landing-soft-card border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                File a Complaint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                To submit and track complaints, please log in to your consumer account. You can choose complaint
                category, describe the issue, and monitor resolution progress.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/login">
                  <Button size="sm">Login to Portal</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="outline">
                    New User? Register
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

