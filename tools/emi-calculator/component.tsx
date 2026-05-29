"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "@/components/ui/lucide-icon";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("1000000"); // 10 Lakhs default
  const [interestRate, setInterestRate] = useState<string>("8.5"); // 8.5% default
  const [tenureYears, setTenureYears] = useState<string>("20"); // 20 years default

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [interestPercent, setInterestPercent] = useState<number>(0);
  const [principalPercent, setPrincipalPercent] = useState<number>(0);

  const calculateEmi = () => {
    const P = parseFloat(loanAmount);
    const annualR = parseFloat(interestRate);
    const N = parseFloat(tenureYears) * 12; // Months

    if (isNaN(P) || isNaN(annualR) || isNaN(N) || P <= 0 || annualR <= 0 || N <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    const r = annualR / 12 / 100; // Monthly interest rate

    // EMI formula: E = P * r * (1 + r)^N / ((1 + r)^N - 1)
    const emiValue = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const payTotal = emiValue * N;
    const interestTotal = payTotal - P;

    setEmi(Math.round(emiValue));
    setTotalInterest(Math.round(interestTotal));
    setTotalPayment(Math.round(payTotal));

    // Calculate percentage breakdown
    const total = payTotal;
    setPrincipalPercent(Math.round((P / total) * 100));
    setInterestPercent(Math.round((interestTotal / total) * 100));
  };

  useEffect(() => {
    calculateEmi();
  }, [loanAmount, interestRate, tenureYears]);

  // Format currency helper
  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">EMI Loan Calculator</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Calculate your Equated Monthly Installment (EMI) for home, personal, or car loans. View the detailed loan breakdown percentage chart between principal amounts and interest rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Fields */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60 shadow-sm p-6 space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 pb-2 flex items-center gap-1.5">
              <LucideIcon name="Settings" size={14} />
              Loan Specifications
            </h3>

            {/* Loan Amount Input + Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Loan Amount:</span>
                <span className="text-foreground font-bold">{formatCurrency(parseFloat(loanAmount) || 0)}</span>
              </div>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount..."
                className="font-mono"
              />
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={loanAmount || "100000"}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Interest rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Interest Rate (Annual %):</span>
                <span className="text-foreground font-bold">{interestRate}%</span>
              </div>
              <Input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Interest percentage..."
                className="font-mono"
              />
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={interestRate || "8"}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Loan Tenure */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground">Loan Tenure (Years):</span>
                <span className="text-foreground font-bold">{tenureYears} Years</span>
              </div>
              <Input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
                placeholder="Tenure in years..."
                className="font-mono"
              />
              <input
                type="range"
                min="1"
                max="30"
                value={tenureYears || "5"}
                onChange={(e) => setTenureYears(e.target.value)}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </Card>
        </div>

        {/* Right Summary Display Card */}
        <div className="lg:col-span-1">
          <Card className="h-full border-border/60 bg-card/60 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center flex-1 space-y-6">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 w-full text-center pb-2">
                Monthly Loan EMI
              </h4>

              {/* Huge EMI display */}
              <div className="text-center space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-indigo-500 dark:text-indigo-400">
                  {formatCurrency(emi)}
                </p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Per Month</p>
              </div>

              {/* Breakdown lists */}
              <div className="w-full space-y-2 border-y border-border/30 py-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Principal Amount:</span>
                  <span className="text-foreground font-bold">{formatCurrency(parseFloat(loanAmount) || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Interest:</span>
                  <span className="text-foreground font-bold">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Payments:</span>
                  <span className="text-foreground font-bold">{formatCurrency(totalPayment)}</span>
                </div>
              </div>

              {/* Visual Breakdown bar */}
              {emi > 0 && (
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    <span>Principal ({principalPercent}%)</span>
                    <span>Interest ({interestPercent}%)</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden flex">
                    <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${principalPercent}%` }} />
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${interestPercent}%` }} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border/40 bg-muted/20 text-center text-[10px] font-semibold text-muted-foreground/80 leading-relaxed">
              *All EMI interest rates are calculated using reducing balance amortization scales.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
