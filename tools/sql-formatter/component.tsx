"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower">("upper");

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    // A lightweight, responsive SQL formatting regex-based parser.
    // Handles capitalization, newlines before major keywords, and indent alignments.
    let sql = input.trim();

    // Standard SQL Keywords
    const keywords = [
      "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", 
      "INNER JOIN", "OUTER JOIN", "ON", "AND", "OR", "GROUP BY", 
      "ORDER BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", 
      "UPDATE", "SET", "DELETE FROM"
    ];

    // 1. Normalize spaces
    sql = sql.replace(/\s+/g, " ");

    // 2. Format keywords based on preference and insert newlines
    keywords.forEach((keyword) => {
      const escapedKeyword = keyword.replace(" ", "\\s+");
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, "gi");
      
      const formattedKeyword = 
        keywordCase === "upper" 
          ? keyword.toUpperCase() 
          : keyword.toLowerCase();
      
      // Inject newlines before major SQL components
      if (["SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "GROUP BY", "ORDER BY", "INSERT INTO", "UPDATE", "DELETE FROM"].includes(keyword)) {
        sql = sql.replace(regex, `\n${formattedKeyword}`);
      } else {
        sql = sql.replace(regex, `${formattedKeyword}`);
      }
    });

    // 3. Clean up leading newlines & redundant spaces
    sql = sql.replace(/\n\s*\n/g, "\n");
    sql = sql.trim();

    // 4. Format SELECT columns (split on commas if in SELECT block, for nice alignment)
    // To keep it simple and robust, align commas inside where lists
    sql = sql.replace(/,\s*/g, ", ");

    setOutput(sql);
  };

  const handleLoadSample = () => {
    setInput(
      "select id, name, email, created_at from users left join orders on users.id = orders.user_id where orders.status = 'completed' and orders.total > 100 group by users.id order by orders.total desc limit 10;"
    );
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">SQL Query Formatter</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Beautify your complex database query syntax. Insert logical spacing, align joins, toggle upper/lowercase keywords, and clean up inline queries. Works entirely locally.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="Database" size={14} />
              Raw Query Input
            </label>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-xs h-8 cursor-pointer" onClick={handleLoadSample}>
                Sample SQL
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:bg-destructive/10 cursor-pointer" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your unformatted SQL query here..."
            className="font-mono text-xs min-h-[320px] p-4 bg-card"
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LucideIcon name="AlignLeft" size={14} />
              Beautified SQL
            </label>
            {output && (
              <Button variant="ghost" size="sm" className="text-xs h-8 text-indigo-500 hover:bg-indigo-500/10 cursor-pointer" onClick={handleCopy}>
                <LucideIcon name="Copy" size={12} className="mr-1" />
                Copy Query
              </Button>
            )}
          </div>
          <Textarea
            readOnly
            value={output}
            placeholder="Formatted SQL output will appear here..."
            className="font-mono text-xs min-h-[320px] p-4 bg-muted/30 cursor-text"
          />
        </div>
      </div>

      {/* Control bar */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-muted-foreground">Keyword Case:</span>
            <div className="flex border border-border rounded-lg overflow-hidden bg-background">
              <button
                onClick={() => setKeywordCase("upper")}
                className={`px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  keywordCase === "upper" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >
                UPPERCASE
              </button>
              <button
                onClick={() => setKeywordCase("lower")}
                className={`px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  keywordCase === "lower" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >
                lowercase
              </button>
            </div>
          </div>
          <Button onClick={handleFormat} className="cursor-pointer bg-indigo-600 hover:bg-indigo-700">
            <LucideIcon name="Sparkles" size={14} className="mr-1.5" />
            Format SQL Query
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
