"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  numOriginal?: number;
  numModified?: number;
}

export default function TextDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [viewMode, setViewMode] = useState<"split" | "inline">("inline");
  const [hasChecked, setHasChecked] = useState(false);

  // A robust client-side line-by-line diff algorithm
  const checkDiff = () => {
    const origLines = original.split("\n");
    const modLines = modified.split("\n");
    const result: DiffLine[] = [];

    let oIdx = 0;
    let mIdx = 0;

    // Direct comparison parser
    while (oIdx < origLines.length || mIdx < modLines.length) {
      const oLine = origLines[oIdx];
      const mLine = modLines[mIdx];

      if (oIdx >= origLines.length) {
        // Remaining modified lines are all additions
        result.push({ type: "added", text: mLine, numModified: mIdx + 1 });
        mIdx++;
      } else if (mIdx >= modLines.length) {
        // Remaining original lines are all removals
        result.push({ type: "removed", text: oLine, numOriginal: oIdx + 1 });
        oIdx++;
      } else if (oLine === mLine) {
        // Unchanged lines
        result.push({
          type: "unchanged",
          text: oLine,
          numOriginal: oIdx + 1,
          numModified: mIdx + 1,
        });
        oIdx++;
        mIdx++;
      } else {
        // Lines differ. Check lookahead to see if it's a insertion or deletion
        let isInsertion = false;
        let isDeletion = false;

        // Check if current modified line matches a future original line (deletion occurred)
        for (let i = oIdx + 1; i < Math.min(oIdx + 10, origLines.length); i++) {
          if (origLines[i] === mLine) {
            isDeletion = true;
            break;
          }
        }

        // Check if current original line matches a future modified line (insertion occurred)
        for (let j = mIdx + 1; j < Math.min(mIdx + 10, modLines.length); j++) {
          if (modLines[j] === oLine) {
            isInsertion = true;
            break;
          }
        }

        if (isDeletion && !isInsertion) {
          result.push({ type: "removed", text: oLine, numOriginal: oIdx + 1 });
          oIdx++;
        } else if (isInsertion && !isDeletion) {
          result.push({ type: "added", text: mLine, numModified: mIdx + 1 });
          mIdx++;
        } else {
          // Fallback replacement: show removal then addition
          result.push({ type: "removed", text: oLine, numOriginal: oIdx + 1 });
          result.push({ type: "added", text: mLine, numModified: mIdx + 1 });
          oIdx++;
          mIdx++;
        }
      }
    }

    setDiff(result);
    setHasChecked(true);
  };

  const handleLoadSample = () => {
    setOriginal(
      "{\n  \"name\": \"A-Z Tools\",\n  \"version\": \"1.0.0\",\n  \"openSource\": false,\n  \"features\": [\n    \"formatter\",\n    \"diff check\"\n  ]\n}"
    );
    setModified(
      "{\n  \"name\": \"A-Z Tools\",\n  \"version\": \"1.1.0\",\n  \"openSource\": true,\n  \"features\": [\n    \"formatter\",\n    \"diff check\",\n    \"converters\"\n  ]\n}"
    );
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setDiff([]);
    setHasChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Text Diff Checker</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Compare two text blocks side-by-side or inline to spot formatting additions, layout deletions, and coding differences. Perfect for developers looking to audit configuration or syntax changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="History" size={14} />
              Original Text (Before)
            </label>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-xs h-8 cursor-pointer" onClick={handleLoadSample}>
                Sample
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:bg-destructive/10 cursor-pointer" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Enter the original text block..."
            className="font-mono text-xs min-h-[220px] p-4 bg-card"
          />
        </div>

        {/* Modified panel */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 h-8">
            <LucideIcon name="FilePlus" size={14} />
            Modified Text (After)
          </label>
          <Textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Enter the modified text block..."
            className="font-mono text-xs min-h-[220px] p-4 bg-card"
          />
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border/40 pb-4">
        <div className="flex border border-border/80 rounded-xl overflow-hidden bg-card">
          <button
            onClick={() => setViewMode("inline")}
            className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === "inline" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <LucideIcon name="AlignLeft" size={12} />
            Unified Inline
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === "split" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <LucideIcon name="Columns2" size={12} />
            Split Screen
          </button>
        </div>
        <Button onClick={checkDiff} className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
          <LucideIcon name="Sparkles" size={14} className="mr-1.5" />
          Compare Text Differences
        </Button>
      </div>

      {/* Comparison visualizer */}
      {hasChecked && (
        <Card className="border-border/60 overflow-hidden shadow-sm">
          {viewMode === "inline" ? (
            <div className="font-mono text-xs divide-y divide-border/20 overflow-x-auto min-h-[150px]">
              {diff.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start px-4 py-1.5 select-all whitespace-pre ${
                    line.type === "added"
                      ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500"
                      : line.type === "removed"
                        ? "bg-red-500/5 text-red-600 dark:text-red-400 border-l-4 border-red-500"
                        : "bg-transparent text-foreground"
                  }`}
                >
                  <div className="w-12 text-[10px] text-muted-foreground/60 text-right pr-4 select-none shrink-0">
                    {line.numOriginal || ""}
                  </div>
                  <div className="w-12 text-[10px] text-muted-foreground/60 text-right pr-4 border-r border-border/20 select-none shrink-0">
                    {line.numModified || ""}
                  </div>
                  <span className="pl-4 leading-relaxed font-semibold">
                    {line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  "}
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-border font-mono text-xs min-h-[150px]">
              {/* Left Column: Original removals */}
              <div className="divide-y divide-border/10 overflow-x-auto">
                <div className="bg-muted/40 p-2 font-bold text-[10px] uppercase text-muted-foreground border-b border-border/30 tracking-wider">Original side</div>
                {diff
                  .filter((line) => line.type !== "added")
                  .map((line, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start px-4 py-1.5 select-all whitespace-pre ${
                        line.type === "removed" ? "bg-red-500/5 text-red-600 dark:text-red-400 border-l-4 border-red-500" : ""
                      }`}
                    >
                      <span className="w-8 text-[9px] text-muted-foreground/50 text-right pr-3 select-none">{line.numOriginal || ""}</span>
                      <span className="leading-relaxed font-semibold">{line.text}</span>
                    </div>
                  ))}
              </div>

              {/* Right Column: Modified additions */}
              <div className="divide-y divide-border/10 overflow-x-auto">
                <div className="bg-muted/40 p-2 font-bold text-[10px] uppercase text-muted-foreground border-b border-border/30 tracking-wider">Modified side</div>
                {diff
                  .filter((line) => line.type !== "removed")
                  .map((line, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start px-4 py-1.5 select-all whitespace-pre ${
                        line.type === "added" ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500" : ""
                      }`}
                    >
                      <span className="w-8 text-[9px] text-muted-foreground/50 text-right pr-3 select-none">{line.numModified || ""}</span>
                      <span className="leading-relaxed font-semibold">{line.text}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
