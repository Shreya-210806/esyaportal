import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Shield, ClipboardList } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import { useNavigate } from 'react-router-dom';

export default function ResidentialConnectionPage() {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/mobile-verification');
  };
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="container mx-auto px-4 py-10 md:py-14">
        {/* Hero */}
        <section className="max-w-5xl mx-auto mb-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-4">
                <Shield className="w-4 h-4" />
                Residential Electricity Connection
              </p>
              <h1 className="landing-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Apply for a New Residential Electricity Connection
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                This section provides key information about eligibility, required documents, deposits, and charges
                for obtaining a new low-tension (LT) residential electricity connection.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-[hsl(225,78%,38%)] via-[hsl(230,78%,44%)] to-[hsl(191,100%,42%)] text-white shadow-md hover:brightness-110 transition-transform hover:-translate-y-0.5"
                  onClick={handleApplyNow}
                >
                  Apply Now
                </Button>
                <Link to="/application-tracking">
                  <Button size="lg" variant="outline" className="rounded-xl">
                    Track Application
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="shadow-card border-border/70 bg-card/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Connection Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Supply Type</span>
                  <span className="font-medium text-foreground">LT – Residential</span>
                </div>
                <div className="flex justify-between">
                  <span>Sanctioned Load Range</span>
                  <span className="font-medium text-foreground">Up to 10 kW</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase</span>
                  <span className="font-medium text-foreground">Single / Three Phase</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Cycle</span>
                  <span className="font-medium text-foreground">Monthly</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Info Sections */}
        <section className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
          <Card className="shadow-card border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Applicability of Tariff</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Residential tariff is applicable to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Individual households, apartments, and residential societies</li>
                <li>Domestic use such as lighting, fans, home appliances, and EV charging at home</li>
                <li>Small home offices where commercial activity is not the primary use</li>
              </ul>
              <p className="text-xs mt-2">
                Final tariff slab and category will be confirmed at the time of connection approval as per
                your state electricity regulatory commission regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Documents Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Please keep clear scanned copies of the following documents ready:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Identity Proof – Aadhaar Card / PAN Card / Passport</li>
                <li>Address Proof – Aadhaar, Driving License, Voter ID, Rent Agreement, or Property Tax Receipt</li>
                <li>Ownership / Occupancy Proof – Sale Deed, Lease Deed, or NOC from Owner</li>
                <li>Recent Passport Size Photograph of the Applicant</li>
              </ul>
              <p className="text-xs">
                All documents must be valid, legible, and self-attested as per utility requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Security Deposit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                A refundable security deposit is collected at the time of new connection based on the sanctioned load:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Up to 2 kW – as per 1 month&apos;s estimated consumption</li>
                <li>2 kW to 5 kW – as per 2 months&apos; estimated consumption</li>
                <li>Above 5 kW – as per approved schedule of the utility</li>
              </ul>
              <p className="text-xs">
                The deposit is adjustable / refundable at the time of permanent disconnection, subject to clearance
                of all outstanding dues.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Schedule of Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Typical one-time charges (subject to applicable regulations and taxes) include:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Application / Processing Fee</li>
                <li>Service Line &amp; Meter Installation Charges</li>
                <li>Meter Testing / Calibration Charges, if applicable</li>
                <li>Stamp Duty or Agreement Charges, where mandated</li>
              </ul>
              <p className="text-xs">
                Exact amounts and applicable taxes will be displayed during the online application journey
                before final submission.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA Strip */}
        <section className="max-w-5xl mx-auto mt-10">
          <Card className="border-dashed border-2 border-border/70 bg-muted/40">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Ready to proceed with your Electricity Connection?</p>
                <p className="text-xs text-muted-foreground">
                  You can submit a new application online or log in to track an existing request.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/mobile-verification">
                  <Button size="sm" className="rounded-full">
                    Apply Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" variant="outline" className="rounded-full">
                    Track Application
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

