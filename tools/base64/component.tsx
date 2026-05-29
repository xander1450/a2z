"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        // UTF-8 base64 encoding fallback support
        const encoded = btoa(
          encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          )
        );
        setOutput(encoded);
      } else {
        // UTF-8 base64 decoding fallback support
        const decoded = decodeURIComponent(
          atob(input.trim())
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        setOutput(decoded);
      }
    } catch (err: any) {
      if (mode === "decode") {
        setError("Invalid Base64 character string. Cannot decode.");
      } else {
        setError(err.message || "Conversion error");
      }
      setOutput("");
    }
  }, [input, mode]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      // clip permission
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

  const handleToggleMode = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output); // Transfer output to input for easy chaining
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Base64 Encoder & Decoder</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Encode plain text strings safely into Base64 format for networks, or decode Base64 codes back into readable strings. Live, instant, secure client-side execution.
        </p>
      </div>

      {/* Mode Switches */}
      <div className="flex border border-border/80 rounded-xl overflow-hidden max-w-xs bg-card">
        <button
          onClick={() => setMode("encode")}
          className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === "encode" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
          }`}
        >
          <LucideIcon name="Lock" size={12} />
          Encode Mode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === "decode" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
          }`}
        >
          <LucideIcon name="Unlock" size={12} />
          Decode Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="Binary" size={14} />
              {mode === "encode" ? "Plain Text Input" : "Base64 Code Input"}
            </label>
            <div className="flex items-center gap-1">
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
            placeholder={
              mode === "encode"
                ? "Enter the plain text string to encode..."
                : "Paste the Base64 string to decode..."
            }
            className="font-mono text-xs min-h-[300px] p-4 bg-card"
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="Eye" size={14} />
              Result
            </label>
            {output && (
              <Button variant="ghost" size="sm" className="text-xs h-8 text-indigo-500 hover:bg-indigo-500/10 cursor-pointer" onClick={handleCopy}>
                <LucideIcon name="Copy" size={12} className="mr-1" />
                Copy Output
              </Button>
            )}
          </div>
          <Textarea
            readOnly
            value={output}
            placeholder="Result will appear dynamically as you type..."
            className="font-mono text-xs min-h-[300px] p-4 bg-muted/30 cursor-text"
          />
        </div>
      </div>

      {/* Chaining control */}
      {output && !error && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Tip: Swap input and output to chain conversions!
            </span>
            <Button variant="outline" size="sm" onClick={handleToggleMode} className="cursor-pointer">
              <LucideIcon name="ArrowLeftRight" size={14} className="mr-1.5" />
              Swap Input & Output
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-semibold">
          <LucideIcon name="AlertTriangle" size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
