"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Github, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            <span className="text-xl">Next Appwrite</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Starter</span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mr-4">
              <Link href="https://github.com/Alaric-senpai/nextjs-appwrite-starter" target="_blank" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Github className="size-4" />
                <span>GitHub</span>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <AnimatedThemeToggler />
              <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
              <Button asChild className="rounded-full font-medium" size="sm">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
