import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Link2, BarChart3, Palette, Zap, Shield, QrCode } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Link2,
      title: "Branded Short Links",
      desc: "Create memorable vanity URLs or auto-generate 6-character codes. Every link is tracked.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      desc: "Clicks over time, top referrers, device breakdowns — all visualized with beautiful charts.",
    },
    {
      icon: Palette,
      title: "Bio-Link Pages",
      desc: "Build a stunning Linktree-style page with 3 premium themes. Share one link everywhere.",
    },
    {
      icon: QrCode,
      title: "QR Code Generator",
      desc: "Generate and download high-quality QR codes for any short link in a single click.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Pair-token JWT auth, hashed IPs, rate limiting — your data and your users are safe.",
    },
    {
      icon: Zap,
      title: "Blazing Fast Redirects",
      desc: "Indexed lookups and async telemetry ensure zero-latency 302 redirects for every click.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 glass">
        <Link to="/" className="text-xl font-bold tracking-tight gradient-text">
          LinkHub
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-sm font-medium">Log In</Button>
          </Link>
          <Link to="/register">
            <Button className="text-sm font-medium rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02]">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 flex flex-col items-center text-center px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse-glow delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px]" />
          <div className="grid-pattern absolute inset-0 opacity-40" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-sm font-medium text-indigo-400 mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          Powered by MERN Stack
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl animate-fade-in-up">
          Shorten, Share &{" "}
          <span className="gradient-text">Measure</span>
          <br />Every Click
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up delay-200 opacity-0">
          The all-in-one platform for branded short links, real-time analytics, and customizable bio-link pages.
          Built for creators who care about every click.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-in-up delay-300 opacity-0">
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.03]">
              Start for Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold transition-all hover:scale-[1.03]">
              Log In
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 md:gap-16 mt-16 animate-fade-in-up delay-400 opacity-0">
          {[
            { value: "56.8B", label: "Possible Codes" },
            { value: "<50ms", label: "Redirect Speed" },
            { value: "3", label: "Bio Themes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need in{" "}
              <span className="gradient-text">one platform</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Stop juggling multiple tools. LinkHub brings URL shortening, analytics, and bio pages together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className={`group border-muted/60 bg-card/50 backdrop-blur-sm hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0 delay-${(i + 1) * 100}`}
              >
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-bg-animated rounded-3xl p-12 md:p-16 shadow-2xl shadow-purple-500/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to take control of your links?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of creators using LinkHub to shorten, track, and share their links beautifully.
            </p>
            <Link to="/register">
              <Button size="lg" className="rounded-full px-10 h-12 text-base font-semibold bg-white text-indigo-700 hover:bg-white/90 shadow-xl transition-all hover:scale-[1.03]">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-semibold gradient-text">LinkHub</span>
          <span>© {new Date().getFullYear()} LinkHub — Assessment Project 04</span>
        </div>
      </footer>
    </div>
  );
}
