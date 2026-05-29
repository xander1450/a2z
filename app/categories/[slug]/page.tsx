"use client";

import React, { use } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getToolsByCategory } from "@/tools/registry";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(slug);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Link href="/" className="hover:text-foreground transition">Home</Link>
        <LucideIcon name="ChevronRight" size={12} />
        <span className="text-foreground">Categories</span>
        <LucideIcon name="ChevronRight" size={12} />
        <span className="text-foreground font-bold">{category.name}</span>
      </nav>

      {/* Category Header Card */}
      <div className={cn(
        "p-6 sm:p-8 rounded-3xl border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative",
        "border-border/60 hover:shadow-sm transition"
      )}>
        <div className="flex items-center gap-4 relative z-10">
          <div className={cn(
            "h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-sm shrink-0",
            category.gradient
          )}>
            <LucideIcon name={category.icon} size={28} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0 relative z-10">
          <span className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{tools.length}</span>
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">Available Utilities</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {category.name} Catalog
        </h2>
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`} className="group">
                <div className="h-full p-5 rounded-2xl border border-border/60 bg-card hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
                        <LucideIcon name={tool.icon} size={18} />
                      </div>
                      <h3 className="font-bold text-foreground text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="capitalize border border-border/60 bg-muted/40 px-2 py-0.5 rounded-full">Utility</span>
                    <span className="font-semibold group-hover:text-indigo-500 dark:group-hover:text-indigo-400 flex items-center gap-0.5">
                      Open Tool
                      <LucideIcon name="ArrowRight" size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/20">
            <LucideIcon name="Code" className="mx-auto mb-3 text-muted-foreground/40" size={32} />
            <p className="font-semibold text-sm">No tools registered yet</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon! We are adding new utilities in this category daily.</p>
          </div>
        )}
      </div>
    </div>
  );
}
