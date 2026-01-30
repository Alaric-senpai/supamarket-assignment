import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Smartphone,
  BarChart3,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Multi-Branch Shopping",
      description: "Shop from any branch with real-time inventory tracking",
      items: ["Branch Selection", "Live Stock Updates", "Cart Management"]
    },
    {
      icon: Smartphone,
      title: "M-Pesa Integration",
      description: "Seamless mobile money payments via M-Pesa STK Push",
      items: ["Instant Payments", "Transaction History", "Receipt Generation"]
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Real-time stock tracking across all branches",
      items: ["Stock Alerts", "Auto-Deduction", "Restock Logs"]
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Comprehensive sales reports and insights",
      items: ["Sales by Product", "Branch Performance", "Revenue Tracking"]
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Separate dashboards for customers and admins",
      items: ["Customer Portal", "Admin Dashboard", "Secure Access"]
    },
    {
      icon: TrendingUp,
      title: "Restock Management",
      description: "Efficient inventory restocking from headquarters",
      items: ["Restock Requests", "Audit Trails", "History Tracking"]
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Instant synchronization across all devices",
      items: ["Live Inventory", "Order Status", "Payment Confirmation"]
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and data protection",
      items: ["Authentication", "Data Encryption", "Session Management"]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Automated inventory management and instant payments"
    },
    {
      icon: DollarSign,
      title: "Increase Revenue",
      description: "Better stock management means fewer lost sales"
    },
    {
      icon: Users,
      title: "Happy Customers",
      description: "Fast checkout and real-time stock availability"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
        <LandingNavbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-32">
          {/* Spotlight Effect */}
          <div className="absolute inset-0 -z-10 w-full h-full">
            <Spotlight />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 -z-20 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="container px-4 mx-auto relative z-10 text-center">
            
            <div className="inline-flex items-center rounded-full border border-border/40 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-muted-foreground mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Multi-Branch Supermarket System
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent max-w-4xl mx-auto">
              Welcome to <br className="hidden md:block" />
              <span className="text-primary">Supamarket</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A modern distributed supermarket management system with real-time inventory, 
              M-Pesa payments, and comprehensive sales analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/auth/login">
                  <ShoppingCart className="mr-2 size-4" />
                  Start Shopping
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm hover:bg-muted/50">
                <Link href="/auth/signup">
                  Create Account
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 text-sm text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Real-Time Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>M-Pesa Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Multi-Branch Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-y border-border/40 bg-muted/20">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                      <Icon className="size-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                <Package className="size-3 mr-2" />
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything You Need to Run Your Supermarket
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A complete solution for managing inventory, sales, and customer transactions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title}
                    className="group p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all hover:border-border/80 hover:shadow-lg"
                  >
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="size-6" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    <ul className="space-y-1">
                      {feature.items.map((item) => (
                        <li key={item} className="text-xs text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="size-3 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-24 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground">
                Simple steps to start shopping
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Select Branch</h3>
                <p className="text-sm text-muted-foreground">Choose your nearest branch location</p>
              </div>

              <div className="text-center">
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Add to Cart</h3>
                <p className="text-sm text-muted-foreground">Browse products and add items</p>
              </div>

              <div className="text-center">
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Pay with M-Pesa</h3>
                <p className="text-sm text-muted-foreground">Complete payment via STK push</p>
              </div>

              <div className="text-center">
                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Get Confirmation</h3>
                <p className="text-sm text-muted-foreground">Receive order receipt instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Decorative gradient orbs */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
            </div>
            
            <div className="bg-gradient-to-br from-card/80 to-card/40 dark:from-card/50 dark:to-card/20 backdrop-blur-xl rounded-3xl p-16 border border-primary/20 shadow-2xl dark:shadow-primary/10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join Supamarket today and experience seamless shopping with real-time inventory 
                and instant M-Pesa payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg shadow-xl hover:scale-105 transition-transform">
                  <Link href="/signup">
                    Create Account
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg border-2">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t dark:border-border/50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2026 <span className="text-primary font-semibold">Supamarket</span> • All rights reserved</p>
              {/* <p className="mt-2">Built with Next.js, Appwrite & M-Pesa</p> */}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
