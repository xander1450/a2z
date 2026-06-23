"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { cn } from "@/lib/utils";

// Presets for background solid colors
const COLOR_PRESETS = [
  { name: "White", value: "#ffffff" },
  { name: "Off-White", value: "#f5f5f7" },
  { name: "Light Blue", value: "#e0f2fe" },
  { name: "Soft Lavender", value: "#f3e8ff" },
  { name: "Teal Mint", value: "#ccfbf1" },
  { name: "Dark Indigo", value: "#1e1b4b" },
  { name: "Midnight Charcoal", value: "#1e293b" },
];

// Presets for background gradients
const GRADIENT_PRESETS = [
  { name: "Cosmic Sunset", value: "sunset", css: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)", colors: ["#ff7e5f", "#feb47b"] },
  { name: "Cool Ocean", value: "ocean", css: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)", colors: ["#2b5876", "#4e4376"] },
  { name: "Cyberpunk Glow", value: "cyberpunk", css: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)", colors: ["#f857a6", "#ff5858"] },
  { name: "Mint Emerald", value: "emerald", css: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", colors: ["#11998e", "#38ef7d"] },
];

type BgType = "transparent" | "color" | "gradient";

export default function BgRemover() {
  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string>("");

  // Processing states
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState<string>("Initializing local AI...");
  const [progressVal, setProgressVal] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // UI state
  const [isDragOver, setIsDragOver] = useState(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [bgType, setBgType] = useState<BgType>("transparent");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [bgGradient, setBgGradient] = useState<string>("sunset");
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpg" | "webp">("png");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear previous object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [imageSrc, outputUrl]);

  // Global paste handler to paste images directly from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WebP).");
      setStatus("error");
      return;
    }

    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setImageFile(file);
    setImageSrc(URL.createObjectURL(file));
    setOutputBlob(null);
    setOutputUrl("");
    setErrorMessage("");
    setStatus("idle");
    setSliderPosition(50);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Run the background removal process using client-side AI
  const processImage = async () => {
    if (!imageFile) return;

    setStatus("loading");
    setProgressVal(0);
    setProgressMsg("Loading AI background remover model...");

    try {
      // Dynamic import to keep build bundle sizes minimal and prevent SSR issues
      const { removeBackground } = await import("@imgly/background-removal");

      const blob = await removeBackground(imageFile, {
        progress: (key: string, current: number, total: number) => {
          const percent = total ? Math.round((current / total) * 100) : 0;
          if (key.includes("fetch")) {
            setProgressMsg(`Downloading AI model chunks: ${percent}%`);
            setProgressVal(percent * 0.8); // Reserve last 20% for inference compile
          } else {
            setProgressMsg("Analyzing contours & segmenting image...");
            setProgressVal(85 + Math.min(percent * 0.15, 15));
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputUrl(url);
      setStatus("ready");
      setSliderPosition(50);
    } catch (err: any) {
      console.error("AI background removal error: ", err);
      setErrorMessage(
        err.message || "An error occurred during AI processing. Please try another image."
      );
      setStatus("error");
    }
  };

  const getCanvasGradient = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    preset: string
  ) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const selected = GRADIENT_PRESETS.find((g) => g.value === preset);
    if (selected) {
      grad.addColorStop(0, selected.colors[0]);
      grad.addColorStop(1, selected.colors[1]);
    } else {
      grad.addColorStop(0, "#ff7e5f");
      grad.addColorStop(1, "#feb47b");
    }
    return grad;
  };

  // Helper to compose background color/gradient with canvas and output final image Blob
  const getFinalBlob = async (): Promise<Blob> => {
    if (!outputBlob) throw new Error("No output available");
    if (bgType === "transparent" && downloadFormat !== "jpg") {
      return outputBlob;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = outputUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get 2d context"));
          return;
        }

        // Draw background layer
        if (bgType === "color") {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgType === "gradient") {
          ctx.fillStyle = getCanvasGradient(ctx, canvas.width, canvas.height, bgGradient);
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgType === "transparent" && downloadFormat === "jpg") {
          // JPG does not support transparency, default to white background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw segmented foreground layer
        ctx.drawImage(img, 0, 0);

        const mimeType =
          downloadFormat === "webp"
            ? "image/webp"
            : downloadFormat === "jpg"
            ? "image/jpeg"
            : "image/png";

        const quality = downloadFormat === "jpg" ? 0.92 : undefined;

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas conversion failed"));
          },
          mimeType,
          quality
        );
      };
      img.onerror = (e) => reject(e);
    });
  };

  const handleDownload = async () => {
    try {
      const blob = await getFinalBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const baseName = imageFile?.name.replace(/\.[^/.]+$/, "") || "image";
      const ext = downloadFormat === "jpg" ? "jpg" : downloadFormat === "webp" ? "webp" : "png";
      
      link.href = url;
      link.download = `${baseName}_no_bg.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate download file:", err);
      alert("Could not export the final image.");
    }
  };

  const copyToClipboard = async () => {
    try {
      // Chrome/Safari only support writing png to clipboard
      const pngBlob = bgType === "transparent" && downloadFormat === "png" 
        ? outputBlob 
        : await getFinalBlob();

      if (!pngBlob) return;

      // Ensure the clipboard payload is formatted as image/png
      // Clipboard API generally rejects jpeg/webp formats on write
      let clipboardBlob = pngBlob;
      if (pngBlob.type !== "image/png") {
        clipboardBlob = await new Promise<Blob>((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(pngBlob);
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            canvas.toBlob((b) => {
              if (b) resolve(b);
              else reject(new Error("Clipboard convert fail"));
            }, "image/png");
          };
          img.onerror = (e) => reject(e);
        });
      }

      const item = new ClipboardItem({ "image/png": clipboardBlob });
      await navigator.clipboard.write([item]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard write error: ", err);
      alert("Clipboard copy is not supported in this browser or format. Please try downloading.");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetAll = () => {
    setImageFile(null);
    setImageSrc("");
    setOutputBlob(null);
    setOutputUrl("");
    setStatus("idle");
    setErrorMessage("");
  };

  // Helper CSS class representing checkerboard background
  const checkerboardStyle = {
    backgroundImage: `conic-gradient(rgba(120, 120, 120, 0.12) 0 25%, transparent 0 50%, rgba(120, 120, 120, 0.12) 0 75%, transparent 0)`,
    backgroundSize: "20px 20px",
  };

  // Get active CSS background style for processed image container
  const getContainerBgStyle = () => {
    if (bgType === "color") return { backgroundColor: bgColor };
    if (bgType === "gradient") {
      const selected = GRADIENT_PRESETS.find((g) => g.value === bgGradient);
      return { backgroundImage: selected?.css };
    }
    return checkerboardStyle;
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">AI Background Remover</h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Instantly remove backgrounds from images with professional precision. 
          Uses secure client-side AI processing: your photos never leave your device.
        </p>
      </div>

      {status === "error" && (
        <Card className="border-destructive/30 bg-destructive/5 text-destructive p-4 flex gap-3 items-start rounded-2xl">
          <LucideIcon name="AlertCircle" className="shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs">
            <p className="font-bold">Execution Failed</p>
            <p className="leading-relaxed">{errorMessage}</p>
            <Button size="sm" variant="destructive" onClick={resetAll} className="cursor-pointer">
              Try Uploading Again
            </Button>
          </div>
        </Card>
      )}

      {/* 1. Upload & Idle View */}
      {status === "idle" && !imageSrc && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerFileSelect}
          className={cn(
            "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-300 min-h-[300px] bg-card/40 backdrop-blur-sm",
            isDragOver
              ? "border-indigo-500 bg-indigo-500/5 scale-[1.01] shadow-lg shadow-indigo-500/10"
              : "border-border/80 hover:border-indigo-500/50 hover:bg-card/70"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-inner transition duration-300 group-hover:scale-105">
            <LucideIcon name="UploadCloud" size={32} className="animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-sm text-foreground">Drag and drop your image here</h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Supports PNG, JPEG, WebP. Max size recommended 10MB.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                <LucideIcon name="Keyboard" size={10} />
                You can also paste (Cmd+V) screenshots directly
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. File Selected - Run AI Prompt View */}
      {status === "idle" && imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/60 shadow-sm overflow-hidden flex items-center justify-center p-5 bg-card/60">
            <div className="relative max-h-[400px] max-w-full rounded-xl overflow-hidden shadow border border-border/40">
              <img
                src={imageSrc}
                alt="Selected preview"
                className="max-h-[400px] object-contain rounded-xl"
              />
            </div>
          </Card>
          <Card className="border-border/60 shadow-sm p-6 flex flex-col justify-between h-full bg-card/80">
            <div className="space-y-4">
              <h3 className="font-bold text-sm">Selected Image Detail</h3>
              <div className="space-y-2 text-xs divide-y divide-border/40">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Filename</span>
                  <span className="font-medium truncate max-w-[150px]">{imageFile?.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">Auto-scaling</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="font-medium">
                    {imageFile ? (imageFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                  </span>
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border text-[10px] text-muted-foreground leading-relaxed flex gap-2">
                <LucideIcon name="ShieldAlert" size={14} className="shrink-0 text-indigo-500 mt-0.5" />
                <p>
                  <strong>First-time load details:</strong> Generating requires compiling the AI 
                  engine (~40MB load). Subsequent uses will render immediately.
                </p>
              </div>
            </div>
            <div className="pt-6 space-y-2">
              <Button
                onClick={processImage}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                <LucideIcon name="Sparkles" size={14} className="mr-1.5" />
                Remove Background
              </Button>
              <Button variant="outline" onClick={resetAll} className="w-full cursor-pointer">
                Select Different Image
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 3. Loading & Inference Running View */}
      {status === "loading" && (
        <Card className="border-border/60 shadow-sm p-10 flex flex-col items-center justify-center gap-6 min-h-[300px] bg-card/60 backdrop-blur-sm">
          <div className="relative flex items-center justify-center h-20 w-20">
            <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <LucideIcon name="Brain" size={28} className="text-indigo-500 animate-pulse" />
          </div>
          <div className="space-y-3 text-center max-w-sm">
            <h3 className="font-bold text-sm">{progressMsg}</h3>
            <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden border border-border/20 shadow-inner">
              <div
                className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressVal}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Please keep this tab active. This may take up to a minute on the first download depending on connection speeds.
            </p>
          </div>
        </Card>
      )}

      {/* 4. Complete Output & Configuration View */}
      {status === "ready" && outputUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compare Slider Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/60 shadow-sm overflow-hidden bg-card/40">
              <CardContent className="p-4">
                {/* Horizontal toggle option to swap layouts */}
                <div className="flex justify-between items-center pb-3 border-b border-border/20 mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <LucideIcon name="Sparkles" size={13} className="text-indigo-500" />
                    AI Result Preview
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-muted-foreground font-semibold">Drag slider to compare</span>
                  </div>
                </div>

                {/* Vertical Comparison Split-screen slider container */}
                <div className="relative select-none aspect-video w-full rounded-2xl overflow-hidden border border-border/40 max-h-[500px]">
                  {/* Bottom layer: background options + processed image */}
                  <div
                    className="absolute inset-0 w-full h-full object-contain flex items-center justify-center"
                    style={getContainerBgStyle()}
                  >
                    <img
                      src={outputUrl}
                      alt="Output transparency"
                      className="max-h-full max-w-full object-contain select-none pointer-events-none"
                    />
                  </div>

                  {/* Top layer: original image (clipped) */}
                  <div
                    className="absolute inset-0 w-full h-full object-contain flex items-center justify-center bg-card pointer-events-none overflow-hidden"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt="Original overlay"
                      className="max-h-full max-w-full object-contain select-none"
                    />
                  </div>

                  {/* Vertical sliding divider line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    {/* Floating circular handle pill */}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white shadow-lg border border-border/80 flex items-center justify-center text-zinc-700">
                      <LucideIcon name="ArrowLeftRight" size={12} />
                    </div>
                  </div>

                  {/* Invisible Drag Overlay Input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Settings Sidebar Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/60 bg-card/80 shadow-sm">
              <CardContent className="p-5 space-y-5">
                <h3 className="font-bold text-sm tracking-tight border-b border-border/20 pb-2">
                  Customize Background
                </h3>

                {/* BG Type Select */}
                <div className="flex rounded-xl border border-border overflow-hidden bg-background">
                  <button
                    onClick={() => setBgType("transparent")}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer",
                      bgType === "transparent"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    )}
                  >
                    <LucideIcon name="Grid" size={12} />
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      setBgType("color");
                      if (downloadFormat === "png") setDownloadFormat("png");
                    }}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer",
                      bgType === "color"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    )}
                  >
                    <LucideIcon name="Palette" size={12} />
                    Solid
                  </button>
                  <button
                    onClick={() => {
                      setBgType("gradient");
                      if (downloadFormat === "png") setDownloadFormat("png");
                    }}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer",
                      bgType === "gradient"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    )}
                  >
                    <LucideIcon name="Sparkles" size={12} />
                    Gradient
                  </button>
                </div>

                {/* BG Sub-menus depending on selected type */}
                {bgType === "color" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Pick Solid Background
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-8 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        placeholder="#ffffff"
                        className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setBgColor(color.value)}
                          className={cn(
                            "h-5 w-5 rounded-full border border-border shadow-sm cursor-pointer",
                            bgColor.toLowerCase() === color.value.toLowerCase() &&
                              "ring-2 ring-indigo-500 ring-offset-1"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {bgType === "gradient" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Select Gradient Theme
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {GRADIENT_PRESETS.map((grad) => (
                        <button
                          key={grad.value}
                          onClick={() => setBgGradient(grad.value)}
                          className={cn(
                            "h-8 rounded-lg text-[10px] font-bold text-white shadow-sm border border-white/10 flex items-center justify-center cursor-pointer transition active:scale-[0.98]",
                            bgGradient === grad.value
                              ? "ring-2 ring-indigo-500 ring-offset-1"
                              : "opacity-80 hover:opacity-100"
                          )}
                          style={{ backgroundImage: grad.css }}
                        >
                          {grad.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Options */}
                <div className="space-y-4 pt-3 border-t border-border/40">
                  <h3 className="font-bold text-sm tracking-tight">Export Settings</h3>
                  
                  {/* Download format selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Output Format
                    </label>
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value as any)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="png">PNG (Lossless, Transparent)</option>
                      {bgType !== "transparent" && <option value="jpg">JPEG (Optimized File Size)</option>}
                      <option value="webp">WebP (Modern, Compact)</option>
                    </select>
                    {downloadFormat === "jpg" && (
                      <p className="text-[9px] text-amber-500 leading-normal font-semibold">
                        Note: JPEG does not support transparency. Alpha channels will flatten onto the selected color.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions card */}
            <Card className="border-border/60 bg-muted/20 shadow-sm p-4 flex flex-col gap-2">
              <Button
                onClick={handleDownload}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                <LucideIcon name="Download" size={14} className="mr-1.5" />
                Download Final Image
              </Button>
              
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="w-full cursor-pointer"
              >
                <LucideIcon name={copied ? "Check" : "Copy"} size={14} className="mr-1.5" />
                {copied ? "Copied PNG!" : "Copy Output (PNG)"}
              </Button>

              <Button
                variant="ghost"
                onClick={resetAll}
                className="w-full border border-dashed border-border text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LucideIcon name="RefreshCcw" size={12} className="mr-1.5" />
                Upload New Image
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
