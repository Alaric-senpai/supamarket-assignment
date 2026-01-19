import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  Lock, 
  Mail, 
  Github, 
  Chrome,
  LayoutDashboard,
  User,
  Zap,
  Database,
  CheckCircle2,
  Crown,
  Terminal as TerminalIcon,
  Code2,
  Settings,
  Repeat,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { Terminal, AnimatedSpan } from "@/components/ui/terminal";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Authentication",
      description: "Complete auth system with email/password, magic links, and OAuth providers",
      items: ["Email/Password", "Magic Links", "Session Management"]
    },
    {
      icon: Chrome,
      title: "OAuth Providers",
      description: "Seamless integration with popular OAuth providers",
      items: ["GitHub OAuth", "Google OAuth", "Extensible Provider System"]
    },
    {
      icon: Lock,
      title: "Security",
      description: "Enterprise-grade security with route protection and proxy",
      items: ["Route Guards", "Session Validation", "CSRF Protection"]
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard UI",
      description: "Beautiful, responsive dashboard with modern components",
      items: ["Responsive Design", "Dark Mode Support", "Component Library"]
    },
    {
      icon: User,
      title: "Account Management",
      description: "Complete user account operations and profile management",
      items: ["Profile Updates", "Password Changes", "Account Deletion"]
    },
    {
      icon: Database,
      title: "Appwrite Integration",
      description: "Full-featured Appwrite backend integration",
      items: ["Database Operations", "File Storage", "Real-time Updates"]
    },
    {
      icon: Zap,
      title: "Dev Experience",
      description: "Modern stack with best practices and tooling",
      items: ["TypeScript", "Tailwind CSS", "React Hook Form"]
    },
    {
      icon: Crown,
      title: "Access Control",
      description: "Supports role based dashboards for admin and client",
      items: ['Admin Dashboard', "Client Dashboard"]
    }
  ];

  const techStack = [
    "Next.js",
    "Appwrite",
    "TypeScript",
    "Tailwind CSS",
    "motion",
    "shadcn",
    "Zod",
    "React Hook Form",
    "Lucide",
    "Tanstack Query"
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
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Production Ready Starter v2.0
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent max-w-4xl mx-auto">
              Build your next idea with <br className="hidden md:block" />
              <span className="text-primary">Next.js & Appwrite</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A minimalistic, performance-first starter template packed with authentication, 
              role-based authorization, and a beautiful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/auth/login">
                  Start Building
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm hover:bg-muted/50">
                <Link href="https://github.com/Alaric-senpai/nextjs-appwrite-starter" target="_blank">
                  <Github className="mr-2 size-4" />
                  Star on GitHub
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 text-sm text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Type-Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Auth Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Modern Stack</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="border-y border-border/40 bg-muted/20">
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
              Powered by modern technologies
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="outline" 
                  className="px-4 py-1.5 text-sm font-normal bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive suite of features to jumpstart your next project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title}
                    className="group p-6 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/50 transition-all hover:border-border/80"
                  >
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="size-6" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Developer Experience */}
        <section className="container mx-auto px-4 py-24 bg-secondary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 bg-background">
                <Code2 className="size-3 mr-2" />
                Developer Experience
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Built for Speed & Reliability
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've handled the boring stuff so you can focus on building your product.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Config Card */}
              <div className="bg-background border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Settings className="size-5 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Type-Safe Config</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Centralized environment configuration with validation and TypeScript support.
                </p>
                <div className="bg-muted/30 rounded-lg p-3 text-xs font-mono text-muted-foreground">
                  appwrite.config.ts
                </div>
              </div>

              {/* Server Actions Card */}
              <div className="bg-background border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Zap className="size-5 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Safe Server Actions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Validated server actions with `next-safe-action` for type-safe backend logic.
                </p>
                <div className="bg-muted/30 rounded-lg p-3 text-xs font-mono text-muted-foreground">
                  actions/safe-action.ts
                </div>
              </div>

              {/* Appwrite Clients Card */}
              <div className="bg-background border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Database className="size-5 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Appwrite Clients</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-configured Admin and Session clients with automatic cookie handling.
                </p>
                <div className="bg-muted/30 rounded-lg p-3 text-xs font-mono text-muted-foreground">
                  server/clients/index.ts
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Decorative gradient orbs */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            
            <div className="bg-linear-to-br from-card/80 to-card/40 dark:from-card/50 dark:to-card/20 backdrop-blur-xl rounded-3xl p-16 border border-primary/20 shadow-2xl dark:shadow-primary/10">
              <Badge variant="secondary" className="mb-6">
                <Sparkles className="size-3 mr-2" />
                Start Building Today
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Ready to Start Building?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Get started with this production-ready template and build your next 
                application with enterprise-grade authentication and security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg shadow-xl bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary dark:shadow-primary/30 hover:scale-105 transition-transform">
                  <Link href="/auth/login">
                    Get Started Now
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg border-2 hover:bg-secondary/80">
                  <Link href="https://github.com" target="_blank">
                    <Github className="mr-2 size-5" />
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t mt-20 dark:border-border/50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>Built with <span className="text-primary">Next.js</span> and <span className="text-primary">Appwrite</span> • MIT License</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
