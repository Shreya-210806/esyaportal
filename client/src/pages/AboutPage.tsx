import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, Users, Award, Globe, Phone } from 'lucide-react';

export default function AboutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isWelcome = searchParams.get('welcome') === '1';

  useEffect(() => {
    if (isWelcome) {
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isWelcome, navigate]);

  return (
    <div className="space-y-8 w-full">
      {isWelcome && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Zap className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">Welcome to Esyasoft! </span>
            <span className="text-sm">You'll be redirected to your dashboard in a few seconds...</span>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-foreground">About Esyasoft</h1>
        <p className="text-muted-foreground text-sm">Powering millions of homes and businesses</p>
      </div>

      <div className="gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Esyasoft Electricity Portal</h2>
            <p className="text-white/70 text-sm">Smart Energy Solutions · Mumbai, Maharashtra</p>
          </div>
        </div>
        <p className="text-white/85 leading-relaxed mb-3">
          Esyasoft Electricity Portal is a modern digital platform designed to provide seamless and efficient electricity services to consumers. Our portal simplifies power management by offering easy access to bill payments, service requests, consumption tracking, and customer support — all in one place.
        </p>
        <p className="text-white/85 leading-relaxed mb-3">
          With a strong focus on innovation, transparency, and customer satisfaction, Esyasoft aims to deliver reliable and uninterrupted power services through advanced technology and smart solutions.
        </p>
        <p className="text-white/85 leading-relaxed mb-3">
          We are committed to enhancing user experience by providing secure online services, real-time updates, and quick complaint resolution. Our goal is to make electricity management simple, fast, and accessible for everyone.
        </p>
        <p className="text-white/85 leading-relaxed">
          Esyasoft continues to empower consumers with smart energy solutions for a sustainable and digitally connected future.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: '2.4M+', label: 'Consumers' },
          { value: '48', label: 'Cities' },
          { value: '99.9%', label: 'Uptime' },
          { value: '20+', label: 'Years' },
        ].map(({ value, label }) => (
          <Card key={label} className="shadow-card border-border/60 text-center">
            <CardContent className="pt-5 pb-4">
              <div className="text-2xl font-bold text-primary">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Shield, title: 'Reliable Service', desc: '24×7 power supply with rapid fault response under 2 hours.' },
          { icon: Users, title: 'Consumer First', desc: 'Dedicated support teams for residential and commercial consumers.' },
          { icon: Award, title: 'Quality Certified', desc: 'ISO 9001 certified operations with BIS-compliant infrastructure.' },
          { icon: Globe, title: 'Green Energy', desc: '30% of our supply comes from renewable sources — solar and wind.' },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="shadow-card border-border/60">
            <CardContent className="pt-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border/60">
        <CardContent className="pt-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />Contact Us
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              ['Head Office', 'Mumbai, Maharashtra'],
              ['Phone', '+91 98765 43210 / 022 1234 5678'],
              ['Email', 'support@esyasoft.com'],
              ['Website', 'www.esyasoft.com'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-muted-foreground text-xs">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
