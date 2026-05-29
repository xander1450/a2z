import React from "react";
import Link from "next/link";
import { LucideIcon } from "./ui/lucide-icon";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md">
                <LucideIcon name="Layers" className="text-white" size={16} />
              </div>
              <span className="text-md font-bold tracking-tight text-foreground">
                A-Z Tools
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              A free, modern, open-source utilities and tools repository built for developers, designers, and creators worldwide. Fully responsive, clean, and instant code utilities.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition">
                <LucideIcon name="Github" size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition">
                <LucideIcon name="Twitter" size={16} />
              </a>
            </div>
          </div>

          {/* Quick categories index */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Tools Categories
            </h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <Link href="/categories/developer-tools" className="hover:text-foreground transition">Developer Utilities</Link>
              </li>
              <li>
                <Link href="/categories/ai-tools" className="hover:text-foreground transition">AI Automations</Link>
              </li>
              <li>
                <Link href="/categories/text-tools" className="hover:text-foreground transition">Text Modifiers</Link>
              </li>
              <li>
                <Link href="/categories/finance-tools" className="hover:text-foreground transition">Finance EMI Tools</Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Platform Info
            </h5>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <span className="flex items-center gap-1.5">
                  <LucideIcon name="Zap" className="text-amber-500" size={12} />
                  Speed Optimized
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5">
                  <LucideIcon name="EyeOff" className="text-indigo-500" size={12} />
                  100% Client-Side Private
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5">
                  <LucideIcon name="CheckCircle" className="text-emerald-500" size={12} />
                  Production Ready
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Base */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} A-Z Tools Platform. Built with Next.js 16, Tailwind CSS, & TypeScript. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
