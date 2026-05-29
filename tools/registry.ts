import { ToolMetadata } from "@/types/tool";

// Statically register metadata for fast indexing, search, and category listing
export const toolsMetadata: ToolMetadata[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate, beautify, and minify your JSON data instantly with syntax highlighting and error checking.",
    category: "developer-tools",
    tags: ["json", "format", "beautify", "minify", "developer"],
    icon: "Braces",
    popular: true,
    featured: true,
    addedAt: "2026-05-01",
    seoTitle: "Free Online JSON Formatter & Beautifier - A-Z Tools",
    seoDescription: "Beautify, format, validate, and minify JSON data online. Built-in syntax highlighting and instant error detection.",
    seoKeywords: ["json formatter", "json beautifier", "format json", "minify json", "json validator"],
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    slug: "sql-formatter",
    description: "Beautify, format, and align your SQL queries online. Supports custom spacing, uppercase keywords, and clean structures.",
    category: "developer-tools",
    tags: ["sql", "database", "format", "query", "developer"],
    icon: "Database",
    popular: true,
    featured: false,
    addedAt: "2026-05-02",
    seoTitle: "Online SQL Query Formatter & Beautifier - A-Z Tools",
    seoDescription: "Format and beautify your SQL queries instantly. Support for standard SQL formatting options like upper/lower keywords.",
    seoKeywords: ["sql formatter", "format sql", "sql beautifier", "beautify database query"],
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    slug: "base64",
    description: "Convert text or strings to Base64 encoding and decode Base64 back into readable text instantly.",
    category: "developer-tools",
    tags: ["base64", "encode", "decode", "cryptography", "developer"],
    icon: "Binary",
    popular: false,
    featured: false,
    addedAt: "2026-05-03",
    seoTitle: "Online Base64 Encoder & Decoder - A-Z Tools",
    seoDescription: "Encode text strings into Base64 format and decode Base64 strings back to readable plain text instantly and securely.",
    seoKeywords: ["base64 encoder", "base64 decoder", "base64 convert", "encode text base64"],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate single or bulk cryptographically secure UUIDs (v4) with hyphens, casing controls, and instant copy.",
    category: "developer-tools",
    tags: ["uuid", "guid", "generator", "random", "developer"],
    icon: "Fingerprint",
    popular: true,
    featured: false,
    addedAt: "2026-05-04",
    seoTitle: "Bulk UUID v4 Generator Online - A-Z Tools",
    seoDescription: "Generate cryptographically secure UUID v4 or v1 in bulk. Supports customize formats like uppercase/lowercase and hyphens.",
    seoKeywords: ["uuid generator", "generate uuid v4", "guid generator", "bulk uuid generator"],
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    slug: "qr-generator",
    description: "Create custom high-resolution QR codes for URLs, text, Wi-Fi, or contacts. Customize colors and download as PNG.",
    category: "image-tools",
    tags: ["qr", "qrcode", "generator", "image", "marketing"],
    icon: "QrCode",
    popular: true,
    featured: true,
    addedAt: "2026-05-05",
    seoTitle: "Free High-Quality QR Code Generator - A-Z Tools",
    seoDescription: "Create free custom QR codes instantly. Customize foreground/background colors, size, and download high-resolution PNGs.",
    seoKeywords: ["qr code generator", "make qr code", "custom qr code", "free qr generator"],
  },
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    description: "Generate highly secure, random passwords. Customize length, numbers, uppercase letters, symbols, and test strength.",
    category: "utility-tools",
    tags: ["password", "security", "random", "generator", "utility"],
    icon: "Lock",
    popular: true,
    featured: true,
    addedAt: "2026-05-06",
    seoTitle: "Secure Random Password Generator - A-Z Tools",
    seoDescription: "Generate cryptographically secure random passwords with configurable parameters. Features an instant password strength checker.",
    seoKeywords: ["password generator", "generate secure password", "random password", "password strength checker"],
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    slug: "unit-converter",
    description: "Quickly convert measurements across Length, Weight, Temperature, Area, and Volume in real-time.",
    category: "utility-tools",
    tags: ["converter", "math", "measurement", "utility"],
    icon: "Scale",
    popular: false,
    featured: false,
    addedAt: "2026-05-07",
    seoTitle: "Multi-Unit Measurement Converter - A-Z Tools",
    seoDescription: "Convert units of length, weight, area, volume, and temperature dynamically in real-time. Responsive metric & imperial calculator.",
    seoKeywords: ["unit converter", "metric imperial converter", "length converter", "weight converter"],
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    slug: "emi-calculator",
    description: "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans. Visual interest breakdowns.",
    category: "finance-tools",
    tags: ["emi", "loan", "calculator", "interest", "finance"],
    icon: "Calculator",
    popular: true,
    featured: true,
    addedAt: "2026-05-08",
    seoTitle: "EMI Loan Calculator with Visual Breakdown - A-Z Tools",
    seoDescription: "Calculate home, personal, or auto loan EMIs online. Generates monthly payments, total interest, and an interactive payment chart.",
    seoKeywords: ["emi calculator", "loan calculator", "home loan emi", "interest calculator"],
  },
  {
    id: "text-diff",
    name: "Text Diff Checker",
    slug: "text-diff",
    description: "Compare two pieces of text side-by-side or inline to find additions, deletions, and differences instantly.",
    category: "text-tools",
    tags: ["diff", "compare", "text", "merge", "developer"],
    icon: "Columns2",
    popular: false,
    featured: false,
    addedAt: "2026-05-09",
    seoTitle: "Online Side-by-Side Text Diff Checker - A-Z Tools",
    seoDescription: "Compare text and code files online. Visual highlight of differences, additions, and deletions side-by-side or inline.",
    seoKeywords: ["diff checker", "text compare", "compare text files", "find text differences"],
  },
  {
    id: "markdown-previewer",
    name: "Markdown Previewer",
    slug: "markdown-previewer",
    description: "Write Markdown in our advanced side-by-side editor and see standard HTML previews rendered in real-time.",
    category: "text-tools",
    tags: ["markdown", "preview", "editor", "html", "writer"],
    icon: "FileEdit",
    popular: false,
    featured: true,
    addedAt: "2026-05-10",
    seoTitle: "Real-Time Markdown Editor & Previewer - A-Z Tools",
    seoDescription: "Write and edit Markdown syntax with instant side-by-side visual HTML previews. Ideal for documentation and markdown writers.",
    seoKeywords: ["markdown editor", "markdown previewer", "render markdown", "write markdown online"],
  },
];

/**
 * Retrieves the tool metadata by its slug.
 */
export function getToolBySlug(slug: string): ToolMetadata | null {
  return toolsMetadata.find((t) => t.slug === slug) || null;
}

/**
 * Returns all registered tools metadata.
 */
export function getAllToolsMetadata(): ToolMetadata[] {
  return toolsMetadata;
}

/**
 * Filters and returns tools under a specific category slug.
 */
export function getToolsByCategory(categorySlug: string): ToolMetadata[] {
  return toolsMetadata.filter((t) => t.category === categorySlug);
}

/**
 * Search tools by name, description, tags, or keywords.
 */
export function searchTools(query: string): ToolMetadata[] {
  if (!query) return toolsMetadata;
  const q = query.toLowerCase().trim();
  return toolsMetadata.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

/**
 * Returns tools flagged as popular.
 */
export function getPopularTools(): ToolMetadata[] {
  return toolsMetadata.filter((t) => t.popular);
}

/**
 * Returns tools in descending order of creation.
 */
export function getRecentTools(): ToolMetadata[] {
  return [...toolsMetadata].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
}

/**
 * Group all tools alphabetically by the first letter of their name.
 */
export function getAlphabeticalGroups(): Record<string, ToolMetadata[]> {
  const groups: Record<string, ToolMetadata[]> = {};
  
  // Initialize A-Z keys
  for (let i = 65; i <= 90; i++) {
    groups[String.fromCharCode(i)] = [];
  }
  
  toolsMetadata.forEach((t) => {
    const firstChar = t.name.charAt(0).toUpperCase();
    if (groups[firstChar]) {
      groups[firstChar].push(t);
    } else {
      if (!groups["#"]) groups["#"] = [];
      groups["#"].push(t);
    }
  });

  // Filter out empty groups for clean UI rendering
  return Object.keys(groups)
    .filter((key) => groups[key].length > 0)
    .reduce((obj, key) => {
      obj[key] = groups[key];
      return obj;
    }, {} as Record<string, ToolMetadata[]>);
}

