"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function UuidGenerator() {
  const [count, setCount] = useState<number>(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);

  // Generate a cryptographically secure random UUID v4 in vanilla JavaScript
  const generateUuidV4 = (): string => {
    const cryptoObj = window.crypto;
    const buffer = new Uint8Array(16);
    cryptoObj.getRandomValues(buffer);

    // Set UUID v4 standard bits
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10xxxxxx

    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      hex.push(buffer[i].toString(16).padStart(2, "0"));
    }

    let uuid = "";
    if (hyphens) {
      uuid = `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
    } else {
      uuid = hex.join("");
    }

    return uppercase ? uuid.toUpperCase() : uuid.toLowerCase();
  };

  const handleGenerate = () => {
    const list: string[] = [];
    const limit = Math.min(Math.max(count, 1), 100);
    for (let i = 0; i < limit; i++) {
      list.push(generateUuidV4());
    }
    setUuids(list);
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  const handleCopySingle = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">UUID v4 Generator</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Generate cryptographically secure random UUID (Universally Unique Identifiers) version 4 strings. Ideal for database primary keys, testing values, or session tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Controls card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5 space-y-5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
                <LucideIcon name="Settings" size={14} />
                Generator Settings
              </h3>

              {/* Count slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="text-primary">{count}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Hyphens toggler */}
              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer group">
                <span className="text-muted-foreground group-hover:text-foreground transition">Include Hyphens:</span>
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer"
                />
              </label>

              {/* Case toggler */}
              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer group">
                <span className="text-muted-foreground group-hover:text-foreground transition">Uppercase format:</span>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer"
                />
              </label>

              {/* Generate button */}
              <Button onClick={handleGenerate} className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                <LucideIcon name="Fingerprint" size={14} className="mr-1.5" />
                Generate UUIDs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Results lists */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="List" size={14} />
              Generated UUID List ({uuids.length})
            </label>
            {uuids.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-8 text-indigo-500 hover:bg-indigo-500/10 cursor-pointer" onClick={handleCopyAll}>
                <LucideIcon name="Copy" size={12} className="mr-1" />
                Copy All List
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/10 min-h-[220px] p-3 max-h-[360px] overflow-y-auto space-y-1.5">
            {uuids.length > 0 ? (
              uuids.map((uuid, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 bg-card hover:bg-secondary/40 border border-border/40 rounded-lg text-xs font-mono select-all transition duration-200 group"
                >
                  <span className="text-foreground">{uuid}</span>
                  <button
                    onClick={() => handleCopySingle(uuid)}
                    className="p-1 hover:bg-secondary rounded opacity-0 group-hover:opacity-100 transition cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Copy this UUID"
                  >
                    <LucideIcon name="Copy" size={12} />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center text-xs text-muted-foreground">
                <LucideIcon name="Hash" className="mb-2 text-muted-foreground/40" size={28} />
                <p className="font-semibold text-foreground">No UUIDs generated yet</p>
                <p className="max-w-[200px] mt-0.5">Click the "Generate UUIDs" button to generate unique sequences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
