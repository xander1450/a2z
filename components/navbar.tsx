"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { LucideIcon } from "./ui/lucide-icon";
import { searchTools, toolsMetadata } from "@/tools/registry";
import { ToolMetadata } from "@/types/tool";
import { Button } from "./ui/button";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolMetadata[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter tools live based on search query
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
    } else {
      setResults(searchTools(query).slice(0, 5));
    }
  }, [query]);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
  }, [searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleSelectTool = (slug: string) => {
    setSearchOpen(false);
    router.push(`/tools/${slug}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <LucideIcon name="Layers" className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent tracking-tight">
                A-Z Tools
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="transition hover:text-foreground">Home</Link>
              <Link href="/#categories" className="transition hover:text-foreground">Categories</Link>
              <Link href="/#popular" className="transition hover:text-foreground">Popular</Link>
              <Link href="/#a-z" className="transition hover:text-foreground">A-Z Index</Link>
            </nav>
          </div>

          {/* Search, Theme, Menu buttons */}
          <div className="flex items-center gap-4">
            {/* Search trigger bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-3 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/80 hover:border-border transition duration-200 cursor-pointer w-48 lg:w-64"
            >
              <LucideIcon name="Search" size={16} />
              <span className="flex-1 text-left">Search tools...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Search Icon Trigger for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden cursor-pointer"
              onClick={() => setSearchOpen(true)}
            >
              <LucideIcon name="Search" size={20} />
            </Button>

            {/* Light/Dark Mode Switch */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <LucideIcon name="Sun" className="text-amber-400" size={20} />
              ) : (
                <LucideIcon name="Moon" className="text-slate-700" size={20} />
              )}
            </Button>

            {/* Mobile Menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <LucideIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile menu expanded */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3 flex flex-col font-medium animate-fade-in">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/40 hover:text-indigo-500 transition"
            >
              Home
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/40 hover:text-indigo-500 transition"
            >
              Categories
            </Link>
            <Link
              href="/#popular"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border/40 hover:text-indigo-500 transition"
            >
              Popular Tools
            </Link>
            <Link
              href="/#a-z"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-indigo-500 transition"
            >
              A-Z Index
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Command Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-fade-in">
          <div
            ref={modalRef}
            className="w-full max-w-lg rounded-xl border border-border/60 bg-card text-card-foreground shadow-2xl glassmorphism overflow-hidden"
          >
            {/* Input wrapper */}
            <div className="flex items-center border-b border-border/60 px-4 py-3">
              <LucideIcon name="Search" className="text-muted-foreground mr-3" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools (e.g. JSON Formatter, EMI Calculator...)"
                className="w-full bg-transparent outline-none border-none text-sm placeholder:text-muted-foreground py-1 text-foreground"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 font-mono"
                onClick={() => setSearchOpen(false)}
              >
                ESC
              </Button>
            </div>

            {/* Scrollable results list */}
            <div className="max-h-[350px] overflow-y-auto p-2">
              {query.trim() === "" ? (
                <div className="py-6 px-4 text-center text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Search A-Z Tools Platform</p>
                  <p>Type a keyword, utility name, or category to find your tool instantly.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {toolsMetadata.slice(0, 4).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTool(t.slug)}
                        className="text-xs border border-border bg-muted/40 hover:bg-muted px-2 py-1 rounded-md transition text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    Matching Utilities ({results.length})
                  </div>
                  {results.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.slug)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition text-left cursor-pointer border border-transparent hover:border-border/40 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <LucideIcon name={tool.icon} size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                        </div>
                      </div>
                      <LucideIcon name="ChevronRight" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition" size={16} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-4 text-center text-sm text-muted-foreground">
                  <LucideIcon name="HelpCircle" className="mx-auto mb-3 text-muted-foreground/60" size={32} />
                  <p className="font-semibold text-foreground mb-1">No tools match "{query}"</p>
                  <p>Try searching for a different keyword or browse our categories instead.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
