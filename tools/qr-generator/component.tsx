"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "@/components/ui/lucide-icon";

type QrType = "url" | "text" | "wifi";

export default function QrGenerator() {
  const [type, setType] = useState<QrType>("url");
  
  // Input fields
  const [url, setUrl] = useState("https://google.com");
  const [text, setText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // QR config
  const [size, setSize] = useState<number>(250);
  const [fgColor, setFgColor] = useState("000000"); // Hex color
  const [bgColor, setBgColor] = useState("ffffff"); // Hex color
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate QR URL matching input properties
  useEffect(() => {
    let rawData = "";
    if (type === "url") {
      rawData = url || "https://google.com";
    } else if (type === "text") {
      rawData = text || "A-Z Tools platform";
    } else if (type === "wifi") {
      rawData = `WIFI:S:${wifiSsid || "SSID"};T:${wifiEncryption};P:${wifiPassword || ""};;`;
    }

    const encodedData = encodeURIComponent(rawData);
    
    // Clean hex symbols from color pickers
    const fg = fgColor.replace("#", "");
    const bg = bgColor.replace("#", "");

    // Using a fast, high-quality, free QR API that doesn't save logs (data is loaded locally)
    const newUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&color=${fg}&ecc=Q&margin=2&bgcolor=${bg}`;
    setQrUrl(newUrl);
  }, [type, url, text, wifiSsid, wifiPassword, wifiEncryption, size, fgColor, bgColor]);

  // Clean helper to download QR code image dynamically using a Blob
  const handleDownload = async () => {
    if (!qrUrl) return;
    setLoading(true);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `qr-code-${type}-${size}x${size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download QR code image", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">QR Code Generator</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Generate high-resolution custom QR codes. Create codes for web addresses (URLs), texts, or instant Wi-Fi setups. Customize foreground/background colors and download PNGs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Card */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5 space-y-5">
              {/* Type selector tab */}
              <div className="flex border border-border/85 rounded-xl overflow-hidden bg-background">
                <button
                  onClick={() => setType("url")}
                  className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    type === "url" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                  }`}
                >
                  <LucideIcon name="Globe" size={13} />
                  Website URL
                </button>
                <button
                  onClick={() => setType("text")}
                  className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    type === "text" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                  }`}
                >
                  <LucideIcon name="Type" size={13} />
                  Plain Text
                </button>
                <button
                  onClick={() => setType("wifi")}
                  className={`flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    type === "wifi" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                  }`}
                >
                  <LucideIcon name="Wifi" size={13} />
                  Wi-Fi Network
                </button>
              </div>

              {/* Dynamic Inputs */}
              {type === "url" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">Website Address (URL)</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {type === "text" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">Plain Text Content</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter the text content to hide in the QR code..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              )}

              {type === "wifi" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">SSID (Network Name)</label>
                    <Input
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="My Home Wi-Fi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">Password</label>
                    <Input
                      type="password"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Security Password"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground">Network Security</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="WPA">WPA / WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Unsecured (Open)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Design Customizations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/40">
                {/* Foreground Color Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">QR Foreground</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={"#" + fgColor}
                      onChange={(e) => setFgColor(e.target.value.replace("#", ""))}
                      className="h-9 w-9 rounded border border-border cursor-pointer shrink-0"
                    />
                    <Input
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value.substring(0, 6))}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Background Color Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">QR Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={"#" + bgColor}
                      onChange={(e) => setBgColor(e.target.value.replace("#", ""))}
                      className="h-9 w-9 rounded border border-border cursor-pointer shrink-0"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value.substring(0, 6))}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Size select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Image Dimensions</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                  >
                    <option value="150">150 x 150 px</option>
                    <option value="250">250 x 250 px</option>
                    <option value="350">350 x 350 px</option>
                    <option value="450">450 x 450 px</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Display frame card */}
        <div className="lg:col-span-1">
          <Card className="h-full border-border/60 bg-card/60 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center flex-1 space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/30 w-full text-center pb-2">
                Live QR Preview
              </h4>
              
              {/* QR Image Box */}
              <div className="h-[210px] w-[210px] bg-white border border-border/80 rounded-xl p-3 flex items-center justify-center shadow relative group overflow-hidden">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="Custom Generated QR Code"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-xs text-muted-foreground">
                    Generating...
                  </div>
                )}
              </div>
              
              <span className="text-[10px] text-muted-foreground max-w-[200px] text-center font-medium leading-relaxed">
                Aim your smartphone's camera at the preview grid to scan instantly.
              </span>
            </div>
            
            <div className="p-4 border-t border-border/40 bg-muted/20">
              <Button
                onClick={handleDownload}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              >
                <LucideIcon name={loading ? "Loader2" : "Download"} size={14} className={loading ? "animate-spin mr-1.5" : "mr-1.5"} />
                {loading ? "Preparing..." : "Download High-Res PNG"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
