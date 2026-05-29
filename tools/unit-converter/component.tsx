"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "@/components/ui/lucide-icon";

type ConversionType = "length" | "weight" | "temperature" | "area";

interface Unit {
  value: string;
  name: string;
}

const UNITS_MAP: Record<ConversionType, Unit[]> = {
  length: [
    { value: "m", name: "Meter (m)" },
    { value: "km", name: "Kilometer (km)" },
    { value: "cm", name: "Centimeter (cm)" },
    { value: "mm", name: "Millimeter (mm)" },
    { value: "inch", name: "Inch (in)" },
    { value: "ft", name: "Foot (ft)" },
    { value: "yard", name: "Yard (yd)" },
    { value: "mile", name: "Mile (mi)" },
  ],
  weight: [
    { value: "kg", name: "Kilogram (kg)" },
    { value: "g", name: "Gram (g)" },
    { value: "mg", name: "Milligram (mg)" },
    { value: "lb", name: "Pound (lb)" },
    { value: "oz", name: "Ounce (oz)" },
  ],
  temperature: [
    { value: "c", name: "Celsius (°C)" },
    { value: "f", name: "Fahrenheit (°F)" },
    { value: "k", name: "Kelvin (K)" },
  ],
  area: [
    { value: "sqm", name: "Square Meter (m²)" },
    { value: "sqkm", name: "Square Kilometer (km²)" },
    { value: "sqft", name: "Square Foot (ft²)" },
    { value: "sqin", name: "Square Inch (in²)" },
    { value: "acre", name: "Acre (ac)" },
    { value: "hectare", name: "Hectare (ha)" },
  ],
};

export default function UnitConverter() {
  const [type, setType] = useState<ConversionType>("length");
  const [inputVal, setInputVal] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<string>("");

  // Update default units when type changes
  useEffect(() => {
    const list = UNITS_MAP[type];
    setFromUnit(list[0].value);
    setToUnit(list[1].value);
  }, [type]);

  // Handle conversion calculations
  useEffect(() => {
    const value = parseFloat(inputVal);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    if (fromUnit === toUnit) {
      setResult(inputVal);
      return;
    }

    let calculated = 0;

    if (type === "length") {
      // Base: meters (m)
      let inMeters = value;
      switch (fromUnit) {
        case "km": inMeters = value * 1000; break;
        case "cm": inMeters = value / 100; break;
        case "mm": inMeters = value / 1000; break;
        case "inch": inMeters = value * 0.0254; break;
        case "ft": inMeters = value * 0.3048; break;
        case "yard": inMeters = value * 0.9144; break;
        case "mile": inMeters = value * 1609.344; break;
      }
      switch (toUnit) {
        case "m": calculated = inMeters; break;
        case "km": calculated = inMeters / 1000; break;
        case "cm": calculated = inMeters * 100; break;
        case "mm": calculated = inMeters * 1000; break;
        case "inch": calculated = inMeters / 0.0254; break;
        case "ft": calculated = inMeters / 0.3048; break;
        case "yard": calculated = inMeters / 0.9144; break;
        case "mile": calculated = inMeters / 1609.344; break;
      }
    } else if (type === "weight") {
      // Base: grams (g)
      let inGrams = value;
      switch (fromUnit) {
        case "kg": inGrams = value * 1000; break;
        case "mg": inGrams = value / 1000; break;
        case "lb": inGrams = value * 453.59237; break;
        case "oz": inGrams = value * 28.34952; break;
      }
      switch (toUnit) {
        case "g": calculated = inGrams; break;
        case "kg": calculated = inGrams / 1000; break;
        case "mg": calculated = inGrams * 1000; break;
        case "lb": calculated = inGrams / 453.59237; break;
        case "oz": calculated = inGrams / 28.34952; break;
      }
    } else if (type === "temperature") {
      // Direct equations
      if (fromUnit === "c") {
        if (toUnit === "f") calculated = (value * 9) / 5 + 32;
        if (toUnit === "k") calculated = value + 273.15;
      } else if (fromUnit === "f") {
        if (toUnit === "c") calculated = ((value - 32) * 5) / 9;
        if (toUnit === "k") calculated = ((value - 32) * 5) / 9 + 273.15;
      } else if (fromUnit === "k") {
        if (toUnit === "c") calculated = value - 273.15;
        if (toUnit === "f") calculated = ((value - 273.15) * 9) / 5 + 32;
      }
    } else if (type === "area") {
      // Base: square meters (sqm)
      let inSqm = value;
      switch (fromUnit) {
        case "sqkm": inSqm = value * 1000000; break;
        case "sqft": inSqm = value * 0.092903; break;
        case "sqin": inSqm = value * 0.00064516; break;
        case "acre": inSqm = value * 4046.8564; break;
        case "hectare": inSqm = value * 10000; break;
      }
      switch (toUnit) {
        case "sqm": calculated = inSqm; break;
        case "sqkm": calculated = inSqm / 1000000; break;
        case "sqft": calculated = inSqm / 0.092903; break;
        case "sqin": calculated = inSqm / 0.00064516; break;
        case "acre": calculated = inSqm / 4046.8564; break;
        case "hectare": calculated = inSqm / 10000; break;
      }
    }

    // Format output dynamically
    setResult(
      calculated % 1 === 0 ? calculated.toString() : calculated.toFixed(6).replace(/\.?0+$/, "")
    );
  }, [type, inputVal, fromUnit, toUnit]);

  const unitsList = UNITS_MAP[type] || [];

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Multi-Unit Measurement Converter</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Quickly convert units across Metric and Imperial systems. Supports Lengths, Weights, Temperatures, and Areas in real-time. Instantly calculate outputs as you type.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left tabs selector */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 pb-2 flex items-center gap-1.5">
                <LucideIcon name="Settings" size={14} />
                Converter Categories
              </h3>
              
              <button
                onClick={() => setType("length")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg border border-transparent transition cursor-pointer ${
                  type === "length" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <LucideIcon name="Ruler" size={15} />
                Length Converter
              </button>

              <button
                onClick={() => setType("weight")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg border border-transparent transition cursor-pointer ${
                  type === "weight" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <LucideIcon name="Scale" size={15} />
                Weight Converter
              </button>

              <button
                onClick={() => setType("temperature")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg border border-transparent transition cursor-pointer ${
                  type === "temperature" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <LucideIcon name="Thermometer" size={15} />
                Temperature
              </button>

              <button
                onClick={() => setType("area")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg border border-transparent transition cursor-pointer ${
                  type === "area" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <LucideIcon name="Maximize" size={15} />
                Area / Land size
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic fields */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Input Value */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From Amount</label>
                <Input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Enter value..."
                  className="font-semibold text-sm"
                />
              </div>

              {/* Input unit dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From Unit</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {unitsList.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Equate indicator icon line */}
              <div className="md:col-span-2 flex items-center justify-center py-2 relative">
                <div className="absolute inset-x-0 h-px bg-border/40" />
                <div className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center relative z-10 text-muted-foreground hover:scale-105 transition">
                  <LucideIcon name="ArrowDownUp" size={14} />
                </div>
              </div>

              {/* Calculated Result Output */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Calculated Value</label>
                <Input
                  readOnly
                  value={result}
                  placeholder="Result..."
                  className="font-bold text-sm bg-muted/30 border-muted text-indigo-500 cursor-text"
                />
              </div>

              {/* Output unit dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To Unit</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {unitsList.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
