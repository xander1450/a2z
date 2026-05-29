"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import { getPopularTools } from "@/tools/registry";
import { LucideIcon } from "./ui/lucide-icon";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const popularTools = getPopularTools().slice(0, 5);

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6 p-6 border-r border-border/40 min-h-[calc(100vh-4rem)] bg-background">
      {/* Categories block */}
      <div className="space-y-3">
        <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
          Categories
        </h4>
        <nav className="space-y-1">
          {categories.map((category) => {
            const isActive = pathname === `/categories/${category.slug}`;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-transparent",
                  isActive
                    ? "bg-secondary text-primary border-border/60 shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br text-white",
                    category.gradient
                  )}
                >
                  <LucideIcon name={category.icon} size={15} />
                </div>
                <span className="flex-1 truncate">{category.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Popular tools block */}
      <div className="space-y-3 pt-4 border-t border-border/40">
        <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
          <LucideIcon name="TrendingUp" className="text-amber-500" size={14} />
          Popular Utilities
        </h4>
        <nav className="space-y-1">
          {popularTools.map((tool) => {
            const isActive = pathname === `/tools/${tool.slug}`;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-md transition border border-transparent",
                  isActive
                    ? "bg-secondary text-primary font-bold border-border/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
              >
                <LucideIcon
                  name={tool.icon}
                  className={cn(
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  )}
                  size={14}
                />
                <span className="truncate">{tool.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Extensibility highlight */}
      <div className="mt-auto p-4 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-indigo-500/10 blur-md transition duration-300 group-hover:scale-125" />
        <h5 className="text-xs font-bold text-indigo-500 mb-1 flex items-center gap-1">
          <LucideIcon name="PlusCircle" size={14} />
          Add Your Tool
        </h5>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          A-Z Tools is fully modular. Create a tool folder, define the metadata, and write your component.
        </p>
      </div>
    </aside>
  );
}
