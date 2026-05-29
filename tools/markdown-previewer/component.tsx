"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function MarkdownPreviewer() {
  const [input, setInput] = useState("");
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");

  // Compile raw Markdown text into safe styled HTML using lightweight regex parsers
  const compileMarkdown = (markdown: string): string => {
    if (!markdown) return "";
    let temp = markdown;

    // 1. Escaping basic HTML to prevent XSS vulnerability
    temp = temp
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Multiline code blocks: ```code``` -> <pre><code>code</code></pre>
    temp = temp.replace(/```([\s\S]*?)```/gm, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto font-mono text-xs text-foreground/90 border border-border/60"><code>$1</code></pre>');

    // 3. Inline code: `code` -> <code>code</code>
    temp = temp.replace(/`([^`\n]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded font-mono text-xs font-bold text-indigo-500">$1</code>');

    // 4. Headers: # Heading -> <h1>Heading</h1>
    temp = temp.replace(/^\s*###### (.*$)/gim, '<h6 class="text-xs font-black text-foreground mt-4 mb-2">$1</h6>');
    temp = temp.replace(/^\s*##### (.*$)/gim, '<h5 class="text-sm font-black text-foreground mt-4 mb-2">$1</h5>');
    temp = temp.replace(/^\s*#### (.*$)/gim, '<h4 class="text-md font-bold text-foreground mt-4 mb-2">$1</h4>');
    temp = temp.replace(/^\s*### (.*$)/gim, '<h3 class="text-lg font-bold text-foreground mt-5 mb-2">$1</h3>');
    temp = temp.replace(/^\s*## (.*$)/gim, '<h2 class="text-xl font-extrabold text-foreground border-b border-border/40 pb-2 mt-6 mb-3">$1</h2>');
    temp = temp.replace(/^\s*# (.*$)/gim, '<h1 class="text-2xl sm:text-3xl font-black text-foreground mt-6 mb-4 pb-2 border-b border-border">$1</h1>');

    // 5. Blockquotes: > quote -> <blockquote class="border-l-4 border-indigo-500 pl-4 italic text-muted-foreground my-4">quote</blockquote>
    temp = temp.replace(/^\s*&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-indigo-500/80 bg-indigo-500/5 px-4 py-2 italic text-muted-foreground my-4 rounded-r-lg">$1</blockquote>');

    // 6. Bold: **text** or __text__ -> <strong>text</strong>
    temp = temp.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    temp = temp.replace(/__([^_]+)__/g, '<strong class="font-bold text-foreground">$1</strong>');

    // 7. Italic: *text* or _text_ -> <em>text</em>
    temp = temp.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    temp = temp.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');

    // 8. Hyperlinks: [text](url) -> <a href="url" class="text-indigo-500 hover:underline">text</a>
    temp = temp.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 font-semibold hover:underline flex-inline items-center gap-0.5">$1</a>');

    // 9. Bullet lists: - item or * item -> <li>item</li> (needs wrapping in <ul>)
    temp = temp.replace(/^\s*-\s+(.*$)/gim, '<li class="list-disc ml-5 leading-relaxed">$1</li>');
    temp = temp.replace(/^\s*\*\s+(.*$)/gim, '<li class="list-disc ml-5 leading-relaxed">$1</li>');

    // 10. Horizontal lines: --- -> <hr class="my-6 border-border" />
    temp = temp.replace(/^\s*---\s*$/gm, '<hr class="my-6 border-border/80" />');

    // 11. Process paragraphs (replace single newlines with <br /> and double newlines with spacing)
    // To prevent tags being wrapped, filter out preformatted block headers
    const paragraphs = temp.split("\n");
    const formattedParagraphs = paragraphs.map(p => {
      if (p.trim() === "") return "";
      // If the line already starts with a block tag, do not wrap it in a <p> tag
      if (p.startsWith("<h") || p.startsWith("<li") || p.startsWith("<blockquote") || p.startsWith("<pre") || p.startsWith("<code") || p.startsWith("<hr")) {
        return p;
      }
      return `<p class="leading-relaxed text-sm mb-3">${p}</p>`;
    });

    return formattedParagraphs.join("\n");
  };

  useEffect(() => {
    setHtml(compileMarkdown(input));
  }, [input]);

  const handleLoadSample = () => {
    const sample = `# Markdown Editor & Previewer

Write rich formatted texts using standard markdown syntax.

## Supported Formatting Actions

You can apply multiple text layouts easily:
- **Bold text highlights** to mark key focus terms.
- *Italics layout emphasis* for stylistic notes.
- In-line \`code blocks\` for programming declarations.

### Live Code Highlighting

\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
console.log(calculateSum(5, 10));
\`\`\`

---

> Blockquotes are indented beautifully with color-gradient border blocks.

You can also include external links to resources like [A-Z Tools Hub](https://example.com)!
`;
    setInput(sample);
  };

  const handleClear = () => {
    setInput("");
    setHtml("");
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Markdown Previewer</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Author documentation, blogs, or readmes using standard Markdown. Edit codes side-by-side and see beautifully rendered styled HTML outputs in real-time. Works 100% offline.
        </p>
      </div>

      {/* Control Tabs */}
      <div className="flex border border-border/80 rounded-xl overflow-hidden max-w-xs bg-card">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "edit" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
          }`}
        >
          <LucideIcon name="FileEdit" size={13} />
          Editor
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "preview" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
          }`}
        >
          <LucideIcon name="Eye" size={13} />
          Preview
        </button>
        <button
          onClick={() => setActiveTab("split")}
          className={`hidden sm:flex flex-1 py-2 text-xs font-bold transition items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "split" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
          }`}
        >
          <LucideIcon name="Columns2" size={13} />
          Split
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: activeTab === "split" ? "1fr 1fr" : "1fr" }}>
        {/* Editor panel */}
        {(activeTab === "edit" || activeTab === "split") && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <LucideIcon name="PenTool" size={14} />
                Markdown Input
              </label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-xs h-8 cursor-pointer" onClick={handleLoadSample}>
                  Load Sample
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:bg-destructive/10 cursor-pointer" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start writing markdown text here..."
              className="font-mono text-xs min-h-[350px] p-4 bg-card"
            />
          </div>
        )}

        {/* Preview Panel */}
        {(activeTab === "preview" || activeTab === "split") && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 h-8">
              <LucideIcon name="BookOpen" size={14} />
              Visual Output
            </label>
            <div className="rounded-xl border border-border/60 bg-card p-6 min-h-[350px] overflow-y-auto max-h-[500px]">
              {html ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-xs text-muted-foreground/60 py-20">
                  <LucideIcon name="Edit" className="mb-2 text-muted-foreground/30" size={32} />
                  <p className="font-semibold text-foreground">Markdown Preview is empty</p>
                  <p className="max-w-[200px] mx-auto mt-0.5">Type some Markdown inside the editor to see rendered layouts here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
