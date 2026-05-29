"use client";

import dynamic from "next/dynamic";
import React from "react";

// Client-only dynamic imports of the tools to keep bundle sizes minimal
// and satisfy Next.js Server Components boundaries.
const toolComponentsMap: Record<string, React.ComponentType<any>> = {
  "json-formatter": dynamic(() => import("@/tools/json-formatter/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading JSON Formatter..."),
    ssr: false,
  }),
  "sql-formatter": dynamic(() => import("@/tools/sql-formatter/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading SQL Formatter..."),
    ssr: false,
  }),
  "base64": dynamic(() => import("@/tools/base64/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading Base64 Tool..."),
    ssr: false,
  }),
  "uuid-generator": dynamic(() => import("@/tools/uuid-generator/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading UUID Generator..."),
    ssr: false,
  }),
  "qr-generator": dynamic(() => import("@/tools/qr-generator/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading QR Code Generator..."),
    ssr: false,
  }),
  "password-generator": dynamic(() => import("@/tools/password-generator/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading Password Generator..."),
    ssr: false,
  }),
  "unit-converter": dynamic(() => import("@/tools/unit-converter/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading Unit Converter..."),
    ssr: false,
  }),
  "emi-calculator": dynamic(() => import("@/tools/emi-calculator/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading EMI Calculator..."),
    ssr: false,
  }),
  "text-diff": dynamic(() => import("@/tools/text-diff/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading Diff Checker..."),
    ssr: false,
  }),
  "markdown-previewer": dynamic(() => import("@/tools/markdown-previewer/component"), {
    loading: () => React.createElement("div", { className: "py-10 text-center animate-pulse text-muted-foreground font-medium text-xs" }, "Loading Markdown Previewer..."),
    ssr: false,
  }),
};

export function ToolRenderer({ slug }: { slug: string }) {
  const Component = toolComponentsMap[slug];
  
  if (!Component) {
    return React.createElement(
      "div",
      { className: "py-12 text-center text-muted-foreground text-xs font-semibold" },
      "Tool utility not found."
    );
  }

  return React.createElement(Component);
}
