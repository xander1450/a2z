"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  
  // Complexity states
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [avoidSimilar, setAvoidSimilar] = useState(false);

  const [strength, setStrength] = useState<{ score: number; label: string; color: string }>({
    score: 0,
    label: "Very Weak",
    color: "bg-destructive border-destructive/20 text-destructive",
  });

  // Calculate entropy and score of the current password
  const checkPasswordStrength = (pass: string) => {
    if (!pass) {
      setStrength({ score: 0, label: "Very Weak", color: "bg-destructive" });
      return;
    }
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let label = "Very Weak";
    let color = "bg-red-500 border-red-500/20 text-red-500 bg-red-500/5";
    
    if (score >= 6) {
      label = "Highly Secure";
      color = "bg-emerald-500 border-emerald-500/20 text-emerald-500 bg-emerald-500/5";
    } else if (score >= 4) {
      label = "Strong";
      color = "bg-indigo-500 border-indigo-500/20 text-indigo-500 bg-indigo-500/5";
    } else if (score >= 3) {
      label = "Medium";
      color = "bg-amber-500 border-amber-500/20 text-amber-500 bg-amber-500/5";
    }

    setStrength({ score, label, color });
  };

  const handleGenerate = () => {
    let lowerLetters = "abcdefghijklmnopqrstuvwxyz";
    let upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (avoidSimilar) {
      // Remove i, l, 1, L, o, 0, O, etc.
      lowerLetters = lowerLetters.replace(/[ilo]/g, "");
      upperLetters = upperLetters.replace(/[LO]/g, "");
      numbers = numbers.replace(/[01]/g, "");
      symbols = symbols.replace(/[|]/g, "");
    }

    let charPool = "";
    if (includeLower) charPool += lowerLetters;
    if (includeUpper) charPool += upperLetters;
    if (includeNumbers) charPool += numbers;
    if (includeSymbols) charPool += symbols;

    if (!charPool) {
      setPassword("");
      return;
    }

    let generatedPassword = "";
    const cryptoObj = window.crypto;
    const randomArray = new Uint32Array(length);
    cryptoObj.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomArray[i] % charPool.length;
      generatedPassword += charPool.charAt(randomIndex);
    }

    setPassword(generatedPassword);
    checkPasswordStrength(generatedPassword);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, avoidSimilar]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Secure Password Generator</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Create highly secure, randomized passwords. Protect your email, hosting accounts, and credit registers with customized uppercase, numbers, and special symbol keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings options panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5 space-y-5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/40 pb-2">
                <LucideIcon name="Shield" size={14} />
                Password Parameters
              </h3>

              {/* Slider length */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Character Length:</span>
                  <span className="text-primary font-bold">{length} chars</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Checkboxes parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Uppercase */}
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer animate-fade-in"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition">Uppercase (A-Z)</span>
                </label>

                {/* Lowercase */}
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition">Lowercase (a-z)</span>
                </label>

                {/* Numbers */}
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition">Numbers (0-9)</span>
                </label>

                {/* Symbols */}
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition">Special Symbols (!@#$)</span>
                </label>

                {/* Avoid Similar */}
                <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer group sm:col-span-2 pt-2 border-t border-border/30">
                  <input
                    type="checkbox"
                    checked={avoidSimilar}
                    onChange={(e) => setAvoidSimilar(e.target.checked)}
                    className="rounded border-border h-4 w-4 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition">
                    Exclude Similar Characters (e.g. <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">i, l, 1, L, o, 0</code>)
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password display card */}
        <div className="lg:col-span-1">
          <Card className="h-full border-border/60 bg-card/60 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center flex-1 space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 w-full text-center pb-2">
                Your Password
              </h4>

              {/* Password text field */}
              <div className="w-full bg-secondary/40 border border-border/50 rounded-xl p-4 font-mono text-center break-all select-all text-sm font-semibold select-none min-h-[50px] flex items-center justify-center">
                {password || <span className="text-muted-foreground/40 italic">Check parameters</span>}
              </div>

              {/* Strength bar */}
              {password && (
                <div className={`w-full border px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold ${strength.color}`}>
                  <span>Strength:</span>
                  <span>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/40 bg-muted/20 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={handleGenerate}
              >
                <LucideIcon name="RefreshCw" size={14} className="mr-1" />
                Regenerate
              </Button>
              <Button
                onClick={handleCopy}
                disabled={!password}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              >
                <LucideIcon name="Copy" size={14} className="mr-1" />
                Copy Key
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
