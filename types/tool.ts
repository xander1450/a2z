import React from "react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes
  color: string; // Tailwind text/border accent color
}

export interface ToolMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string; // category slug
  tags: string[];
  icon: string; // Lucide icon name
  popular: boolean;
  featured: boolean;
  addedAt: string; // YYYY-MM-DD
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  isAi?: boolean;
}

export interface Tool {
  metadata: ToolMetadata;
  component: React.ComponentType;
}
