"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = (spaces: number) => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
      setOutput("");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      // Fallback if permission is denied
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleLoadSample = () => {
    const sample = {
      platform: "A-Z Tools",
      version: 1.0,
      active: true,
      features: ["Formatter", "Encoder", "Calculator", "Diff Check"],
      metadata: {
        serverless: true,
        region: "global",
      },
    };
    setInput(JSON.stringify(sample, null, 2));
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">JSON Formatter & Beautifier</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Clean up, format, and validate your raw JSON strings. Minify data for lightweight transfers, or beautify nested structures for debugging. Powered 100% offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="LogIn" size={14} />
              Raw Input JSON
            </label>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-xs h-8 cursor-pointer" onClick={handleLoadSample}>
                Sample
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8 cursor-pointer" onClick={handlePaste}>
                Paste
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:bg-destructive/10 cursor-pointer" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON code here... e.g. {"name":"A-Z Tools","openSource":true}'
            className="font-mono text-xs min-h-[350px] p-4 bg-card"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="LogOut" size={14} />
              Formatted Output
            </label>
            {output && (
              <Button variant="ghost" size="sm" className="text-xs h-8 text-indigo-500 hover:bg-indigo-500/10 cursor-pointer" onClick={handleCopy}>
                <LucideIcon name="Copy" size={12} className="mr-1" />
                Copy
              </Button>
            )}
          </div>
          <div className="relative">
            <Textarea
              readOnly
              value={output}
              placeholder="Output will appear here..."
              className="font-mono text-xs min-h-[350px] p-4 bg-muted/30 focus-visible:ring-0 cursor-text"
            />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => handleFormat(2)} className="cursor-pointer bg-indigo-600 hover:bg-indigo-700">
              Format (2 spaces)
            </Button>
            <Button size="sm" onClick={() => handleFormat(4)} className="cursor-pointer bg-purple-600 hover:bg-purple-700">
              Format (4 spaces)
            </Button>
            <Button variant="outline" size="sm" onClick={handleMinify} className="cursor-pointer">
              Minify / Compress
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-xs font-medium animate-pulse">
              <LucideIcon name="AlertTriangle" size={14} />
              <span className="truncate max-w-xs">{error}</span>
            </div>
          )}
          {!error && output && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-semibold">
              <LucideIcon name="CheckCircle" size={14} />
              Valid JSON
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
