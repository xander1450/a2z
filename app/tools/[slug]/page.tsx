import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, toolsMetadata } from "@/tools/registry";
import { categories } from "@/data/categories";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { ToolRenderer } from "@/components/tool-renderer";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

// Next.js App Router dynamic metadata generator for search engines optimization (SEO)
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: "Tool Not Found - A-Z Tools",
    };
  }

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.seoKeywords,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      type: "website",
    },
  };
}

// Statically pre-render tool pages at build time for extreme loading speeds
export async function generateStaticParams() {
  return toolsMetadata.map((t) => ({
    slug: t.slug,
  }));
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = categories.find((c) => c.slug === tool.category);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Dynamic breadcrumb navigation */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Link href="/" className="hover:text-foreground transition">Home</Link>
        <LucideIcon name="ChevronRight" size={12} />
        {category && (
          <>
            <Link href={`/categories/${category.slug}`} className="hover:text-foreground transition">
              {category.name}
            </Link>
            <LucideIcon name="ChevronRight" size={12} />
          </>
        )}
        <span className="text-foreground font-bold truncate max-w-[150px]">{tool.name}</span>
      </nav>

      {/* Hero Header metadata banner */}
      <div className="space-y-3 sm:space-y-4 border-b border-border/40 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm",
              category.color
            )}>
              <LucideIcon name={category.icon} size={11} />
              {category.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-border/80 bg-muted/40 text-muted-foreground shadow-sm">
            <LucideIcon name="EyeOff" size={11} className="text-indigo-500" />
            100% Private Offline
          </span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {tool.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Dynamic component mounting grid */}
      <div className="w-full">
        <ToolRenderer slug={slug} />
      </div>
    </div>
  );
}

