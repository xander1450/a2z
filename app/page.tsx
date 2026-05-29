"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getAllToolsMetadata, getPopularTools, getRecentTools } from "@/tools/registry";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { cn } from "@/lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const allTools = useMemo(() => getAllToolsMetadata(), []);
  const popularTools = useMemo(() => getPopularTools(), []);
  const recentTools = useMemo(() => getRecentTools(), []);

  // Live filter tools based on search and A-Z selection
  const filteredTools = useMemo(() => {
    let list = allTools;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (selectedLetter) {
      list = list.filter((t) => t.name.startsWith(selectedLetter));
    }
    return list;
  }, [allTools, searchQuery, selectedLetter]);

  // Alphabet list for filter panel
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border border-indigo-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
            <LucideIcon name="Sparkles" size={12} />
            All Your Essential Tools in One Place
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            A-Z Tools Hub
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Free, highly secure, instant client-side utility tools for developer formatters, hashers, conversions, layout diffing, and calculators.
          </p>

          {/* Large Search Box */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <LucideIcon name="Search" size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10+ free utilities (e.g. JSON, SQL, EMI...)"
              className="block w-full pl-10 pr-12 py-3 border border-border/80 rounded-xl bg-card/60 backdrop-blur-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LucideIcon name="XCircle" size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Popular Tools Section */}
      {searchQuery === "" && !selectedLetter && (
        <section id="popular" className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <LucideIcon name="TrendingUp" className="text-indigo-500" size={18} />
              Popular Utilities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.slice(0, 6).map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`} className="group">
                <div className="h-full p-5 rounded-2xl border border-border/60 bg-card hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <LucideIcon name={tool.icon} size={20} />
                      </div>
                      <h3 className="font-bold text-foreground text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="capitalize border border-border/60 bg-muted/40 px-2 py-0.5 rounded-full">{tool.category.replace("-", " ")}</span>
                    <span className="font-semibold group-hover:text-indigo-500 dark:group-hover:text-indigo-400 flex items-center gap-0.5">
                      Open Tool
                      <LucideIcon name="ArrowRight" size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Browse Categories Grid */}
      {searchQuery === "" && !selectedLetter && (
        <section id="categories" className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <LucideIcon name="Grid" className="text-purple-500" size={18} />
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                <div className={cn(
                  "p-5 rounded-2xl border border-border/60 bg-card hover:shadow-sm transition-all duration-300 flex items-start gap-4",
                  "hover:border-purple-500/20"
                )}>
                  <div className={cn(
                    "h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105",
                    category.gradient
                  )}>
                    <LucideIcon name={category.icon} size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-foreground group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Alphabet Index Panel */}
      <section id="a-z" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3 gap-3">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <LucideIcon name="SortAsc" className="text-pink-500" size={18} />
            A-Z Directory Navigation
          </h2>
          {(selectedLetter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLetter(null);
                setSearchQuery("");
              }}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              <LucideIcon name="RefreshCw" size={12} />
              Reset Filters
            </button>
          )}
        </div>

        {/* Letters index cards */}
        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-border/40 bg-card/40">
          {alphabet.map((letter) => {
            const hasTools = allTools.some((t) => t.name.startsWith(letter));
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                disabled={!hasTools}
                onClick={() => setSelectedLetter(isSelected ? null : letter)}
                className={cn(
                  "h-8 w-8 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow"
                    : hasTools
                      ? "bg-card border border-border/60 hover:border-primary hover:text-primary"
                      : "text-muted-foreground/30 border border-transparent cursor-not-allowed bg-transparent"
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Selected List Results */}
        {(selectedLetter || searchQuery) && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {filteredTools.length} matching tool(s) found
            </h3>
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="group">
                    <div className="h-full p-5 rounded-2xl border border-border/60 bg-card hover:border-indigo-500/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
                            <LucideIcon name={tool.icon} size={18} />
                          </div>
                          <h4 className="font-bold text-foreground text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                            {tool.name}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="capitalize border border-border/60 bg-muted/40 px-2 py-0.5 rounded-full">{tool.category.replace("-", " ")}</span>
                        <span className="font-semibold flex items-center gap-0.5">Open</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
                <LucideIcon name="SearchCode" className="mx-auto mb-3 text-muted-foreground/60" size={32} />
                <p className="font-semibold text-sm">No utilities found</p>
                <p className="text-xs text-muted-foreground mt-1">Adjust your search keyword or selected letters filter.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. Recently Added Utilities Feed */}
      {searchQuery === "" && !selectedLetter && (
        <section className="space-y-6 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <LucideIcon name="Calendar" className="text-emerald-500" size={18} />
              Recently Added Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentTools.slice(0, 3).map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`} className="group">
                <div className="p-4 rounded-xl border border-border bg-card/60 hover:shadow-sm hover:border-emerald-500/20 transition-all flex items-start gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <LucideIcon name={tool.icon} size={16} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-foreground group-hover:text-emerald-500 transition-colors">
                        {tool.name}
                      </h4>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider scale-90">NEW</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
