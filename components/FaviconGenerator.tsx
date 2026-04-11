"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import {
  Sun,
  Moon,
  Copy,
  Check,
  Download,
  RotateCcw,
  Lock,
  Type,
  Hash,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShapeType = "square" | "rounded" | "circle";
type BgType = "solid" | "gradient" | "transparent";
type InputMode = "text" | "icon";

interface FaviconConfig {
  inputMode: InputMode;
  text: string;
  selectedIcon: string;
  bgType: BgType;
  bgColor: string;
  bgColor2: string;
  gradientDir: number;
  fgColor: string;
  shape: ShapeType;
  fontSize: number;
  padding: number;
  fontWeight: "400" | "600" | "700" | "800";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_SIZE = 512;

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#18181b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#22c55e",
  "#06b6d4",
  "#eab308",
  "#ef4444",
  "#64748b",
];

const GRADIENT_PRESETS = [
  { label: "Midnight", from: "#0f0c29", to: "#302b63" },
  { label: "Sunrise", from: "#f97316", to: "#eab308" },
  { label: "Ocean", from: "#06b6d4", to: "#3b82f6" },
  { label: "Forest", from: "#22c55e", to: "#06b6d4" },
  { label: "Berry", from: "#8b5cf6", to: "#ec4899" },
  { label: "Slate", from: "#475569", to: "#1e293b" },
];

// Pure unicode symbols — no emojis
const CURATED_ICONS = [
  "★", "♦", "●", "▲", "◆",
  "✦", "⬡", "◈", "❋", "⊕",
  "∞", "⌘", "✿", "⬢", "◉",
  "Ω", "Δ", "Σ", "Λ", "Φ",
];

const EXPORT_SIZES = [16, 32, 48, 64, 96, 180, 192, 512];

const DEFAULT_CONFIG: FaviconConfig = {
  inputMode: "text",
  text: "F",
  selectedIcon: "★",
  bgType: "gradient",
  bgColor: "#3b82f6",
  bgColor2: "#8b5cf6",
  gradientDir: 135,
  fgColor: "#ffffff",
  shape: "rounded",
  fontSize: 55,
  padding: 12,
  fontWeight: "700",
};

// ─── Draw helper ──────────────────────────────────────────────────────────────

function drawFavicon(
  canvas: HTMLCanvasElement,
  config: FaviconConfig,
  size: number = CANVAS_SIZE
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  const radius =
    config.shape === "circle"
      ? size / 2
      : config.shape === "rounded"
      ? size * 0.22
      : 0;

  // Clip to shape
  ctx.beginPath();
  if (config.shape === "circle") {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  } else {
    ctx.roundRect(0, 0, size, size, radius);
  }
  ctx.closePath();
  ctx.save();
  ctx.clip();

  // Background
  if (config.bgType !== "transparent") {
    if (config.bgType === "gradient") {
      const angle = (config.gradientDir * Math.PI) / 180;
      const x1 = size / 2 - (Math.cos(angle) * size) / 2;
      const y1 = size / 2 - (Math.sin(angle) * size) / 2;
      const x2 = size / 2 + (Math.cos(angle) * size) / 2;
      const y2 = size / 2 + (Math.sin(angle) * size) / 2;
      const grd = ctx.createLinearGradient(x1, y1, x2, y2);
      grd.addColorStop(0, config.bgColor);
      grd.addColorStop(1, config.bgColor2);
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = config.bgColor;
    }
    ctx.fillRect(0, 0, size, size);
  }

  ctx.restore();

  // Text / Symbol
  const content =
    config.inputMode === "text" ? config.text : config.selectedIcon;
  const displayText = content.slice(0, 2);
  const fontSizePx = (config.fontSize / 100) * size * (size / CANVAS_SIZE);

  ctx.save();
  ctx.font = `${config.fontWeight} ${fontSizePx}px -apple-system, 'SF Pro Display', 'Inter', sans-serif`;
  ctx.fillStyle = config.fgColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(displayText, size / 2, size / 2 + fontSizePx * 0.04);
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FaviconGenerator() {
  const [config, setConfig] = useState<FaviconConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [darkPreview, setDarkPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const update = useCallback(
    <K extends keyof FaviconConfig>(key: K, value: FaviconConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  useEffect(() => {
    if (canvasRef.current) {
      drawFavicon(canvasRef.current, config, CANVAS_SIZE);
    }
  }, [config]);

  // ── HTML snippet ─────────────────────────────────────────────────────────

  const htmlSnippet = `<!-- Favicon — Generated by FaviconKit -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${config.bgColor}">`;

  const manifestContent = JSON.stringify(
    {
      name: "My App",
      short_name: "App",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: config.bgColor,
      background_color: config.bgColor,
      display: "standalone",
    },
    null,
    2
  );

  // ── Download ─────────────────────────────────────────────────────────────

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("favicon-package")!;

      const sizeNames: Record<number, string> = {
        16: "favicon-16x16.png",
        32: "favicon-32x32.png",
        48: "favicon-48x48.png",
        64: "favicon-64x64.png",
        96: "favicon-96x96.png",
        180: "apple-touch-icon.png",
        192: "android-chrome-192x192.png",
        512: "android-chrome-512x512.png",
      };

      for (const size of EXPORT_SIZES) {
        const offscreen = document.createElement("canvas");
        drawFavicon(offscreen, config, size);
        const blob = await new Promise<Blob>((res) =>
          offscreen.toBlob((b) => res(b!), "image/png")
        );
        folder.file(sizeNames[size], blob);
      }

      folder.file("site.webmanifest", manifestContent);
      folder.file(
        "README.txt",
        `FAVICON PACKAGE — Generated by FaviconKit
==========================================

STEP 1: Upload all .png files and site.webmanifest to your website root directory.

STEP 2: Paste this into your <head>:

${htmlSnippet}

STEP 3: Done. Your favicon is live.

For Next.js: place files in /public
For WordPress: place files in your theme root
For Webflow: upload via Site Settings > Favicon
`
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "favicon-package.zip");
    } finally {
      setDownloading(false);
    }
  };

  // ── Copy ─────────────────────────────────────────────────────────────────

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">

        {/* ── Left col ── */}
        <div className="flex flex-col gap-5">

          {/* Preview card */}
          <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Preview</p>
                <p className="text-xs text-zinc-400">
                  See how it looks in context
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkPreview((d) => !d)}
                className="rounded-full border-zinc-200 text-xs font-medium"
              >
                {darkPreview ? (
                  <span className="flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5" strokeWidth={2} />
                    Light
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5" strokeWidth={2} />
                    Dark
                  </span>
                )}
              </Button>
            </div>

            <div className="p-6">
              {/* Mock browser chrome */}
              <div
                className={`rounded-xl border ${
                  darkPreview
                    ? "border-zinc-700 bg-zinc-900"
                    : "border-zinc-200 bg-zinc-100"
                } p-3`}
              >
                {/* Window controls + tab strip */}
                <div
                  className={`mb-3 flex items-center gap-2 rounded-lg ${
                    darkPreview ? "bg-zinc-800" : "bg-white"
                  } px-3 py-2 shadow-sm`}
                >
                  {/* Traffic lights */}
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <Separator orientation="vertical" className="mx-1 h-4" />
                  {/* Active tab */}
                  <div
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 ${
                      darkPreview ? "bg-zinc-700" : "bg-zinc-100"
                    }`}
                  >
                    <canvas
                      ref={canvasRef}
                      width={CANVAS_SIZE}
                      height={CANVAS_SIZE}
                      className="h-4 w-4 flex-shrink-0 rounded-sm"
                      style={{ imageRendering: "auto" }}
                    />
                    <span
                      className={`text-xs font-medium ${
                        darkPreview ? "text-zinc-200" : "text-zinc-700"
                      }`}
                    >
                      My Website
                    </span>
                    <span
                      className={`text-xs ${
                        darkPreview ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      &times;
                    </span>
                  </div>
                </div>

                {/* Address bar */}
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    darkPreview ? "bg-zinc-800" : "bg-white"
                  } shadow-sm`}
                >
                  <Lock
                    className="h-3 w-3 flex-shrink-0 text-green-500"
                    strokeWidth={2.5}
                  />
                  <span
                    className={`text-xs ${
                      darkPreview ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    mywebsite.com
                  </span>
                </div>
              </div>

              {/* Size grid */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium text-zinc-500">
                  All export sizes
                </p>
                <div className="flex flex-wrap items-end gap-4">
                  {[16, 32, 48, 64, 96, 180].map((size) => (
                    <Tooltip key={size}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1.5">
                          <canvas
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            className="rounded border border-zinc-100"
                            style={{
                              width: size,
                              height: size,
                              imageRendering: "auto",
                            }}
                            ref={(el) => {
                              if (el) drawFavicon(el, config, CANVAS_SIZE);
                            }}
                          />
                          <span className="text-[10px] text-zinc-400">
                            {size}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {size}&times;{size}px
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* HTML snippet card */}
          <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  HTML Snippet
                </p>
                <p className="text-xs text-zinc-400">
                  Paste into your{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono text-zinc-600">
                    &lt;head&gt;
                  </code>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-full border-zinc-200 text-xs font-medium"
              >
                {copied ? (
                  <span className="flex items-center gap-1.5">
                    <Check
                      className="h-3.5 w-3.5 text-green-500"
                      strokeWidth={2.5}
                    />
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                    Copy
                  </span>
                )}
              </Button>
            </div>
            <div className="p-5">
              <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
                <code>{htmlSnippet}</code>
              </pre>
            </div>
          </Card>

          {/* Download */}
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={downloading}
            className="h-12 w-full rounded-2xl bg-zinc-900 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:scale-[0.99]"
          >
            {downloading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Generating package...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" strokeWidth={2} />
                Download favicon package
                <Badge
                  variant="secondary"
                  className="ml-1 rounded-full bg-white/10 px-2 py-0 text-[10px] font-medium text-white/80"
                >
                  8 files + HTML
                </Badge>
              </span>
            )}
          </Button>
        </div>

        {/* ── Right col — controls ── */}
        <div className="flex flex-col gap-4">

          {/* Content */}
          <Card className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Content
            </p>
            <Tabs
              value={config.inputMode}
              onValueChange={(v) => update("inputMode", v as InputMode)}
            >
              <TabsList className="mb-4 w-full rounded-xl bg-zinc-100 p-1">
                <TabsTrigger
                  value="text"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Type className="h-3.5 w-3.5" strokeWidth={2} />
                  Text
                </TabsTrigger>
                <TabsTrigger
                  value="icon"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Hash className="h-3.5 w-3.5" strokeWidth={2} />
                  Symbol
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {config.inputMode === "text" ? (
              <div>
                <input
                  type="text"
                  value={config.text}
                  maxLength={2}
                  onChange={(e) => update("text", e.target.value)}
                  placeholder="F"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-2xl font-bold tracking-tight text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
                />
                <p className="mt-2 text-center text-xs text-zinc-400">
                  Up to 2 characters — initials work great
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {CURATED_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => update("selectedIcon", icon)}
                    className={`flex h-10 w-full items-center justify-center rounded-xl border text-lg font-medium transition hover:border-zinc-400 ${
                      config.selectedIcon === icon
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Background */}
          <Card className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Background
            </p>

            <div className="mb-4 flex gap-2">
              {(["solid", "gradient", "transparent"] as BgType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => update("bgType", t)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition ${
                    config.bgType === t
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {config.bgType !== "transparent" && (
              <>
                {/* Preset swatches */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <Tooltip key={c}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => update("bgColor", c)}
                          className={`h-7 w-7 rounded-lg border-2 transition hover:scale-110 ${
                            config.bgColor === c
                              ? "border-zinc-900 shadow-md"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{c}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Color 1 picker */}
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-lg border border-zinc-200"
                  />
                  <input
                    type="text"
                    value={config.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700 outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                {config.bgType === "gradient" && (
                  <div className="mt-4 space-y-3">
                    {/* Color 2 picker */}
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.bgColor2}
                        onChange={(e) => update("bgColor2", e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded-lg border border-zinc-200"
                      />
                      <input
                        type="text"
                        value={config.bgColor2}
                        onChange={(e) => update("bgColor2", e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700 outline-none focus:border-zinc-400 focus:bg-white"
                      />
                    </div>

                    {/* Gradient presets */}
                    <div>
                      <p className="mb-2 text-xs text-zinc-400">Presets</p>
                      <div className="grid grid-cols-3 gap-2">
                        {GRADIENT_PRESETS.map((g) => (
                          <button
                            key={g.label}
                            onClick={() => {
                              update("bgColor", g.from);
                              update("bgColor2", g.to);
                            }}
                            className="h-8 w-full rounded-lg border border-zinc-200 text-[10px] font-semibold text-white shadow-sm transition hover:scale-[1.03]"
                            style={{
                              background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                            }}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direction slider */}
                    <div>
                      <div className="mb-1.5 flex justify-between">
                        <span className="text-xs text-zinc-500">Direction</span>
                        <span className="text-xs font-medium text-zinc-700">
                          {config.gradientDir}&deg;
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={360}
                        step={45}
                        value={[config.gradientDir]}
                        onValueChange={([v]) => update("gradientDir", v)}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Shape & Style */}
          <Card className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Shape &amp; Style
            </p>

            {/* Shape picker */}
            <div className="mb-4">
              <p className="mb-2 text-xs text-zinc-500">Shape</p>
              <div className="flex gap-2">
                {(["square", "rounded", "circle"] as ShapeType[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => update("shape", s)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-xl border py-3 text-xs font-medium capitalize transition ${
                      config.shape === s
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 border-2 border-zinc-700 bg-zinc-800 ${
                        s === "circle"
                          ? "rounded-full"
                          : s === "rounded"
                          ? "rounded"
                          : "rounded-none"
                      }`}
                    />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Text color */}
            {config.inputMode === "text" && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-zinc-500">Text color</p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.fgColor}
                    onChange={(e) => update("fgColor", e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-lg border border-zinc-200"
                  />
                  <div className="flex gap-2">
                    {["#ffffff", "#000000", "#fafafa", "#18181b"].map((c) => (
                      <button
                        key={c}
                        onClick={() => update("fgColor", c)}
                        className={`h-7 w-7 rounded-lg border-2 transition hover:scale-110 ${
                          config.fgColor === c
                            ? "border-zinc-900 shadow-md"
                            : "border-zinc-200"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Font weight */}
            {config.inputMode === "text" && (
              <div className="mb-4">
                <p className="mb-2 text-xs text-zinc-500">Font weight</p>
                <div className="flex gap-2">
                  {(["400", "600", "700", "800"] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => update("fontWeight", w)}
                      className={`flex-1 rounded-lg border py-2 text-xs transition ${
                        config.fontWeight === w
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                      }`}
                      style={{ fontWeight: w }}
                    >
                      {w === "400"
                        ? "Regular"
                        : w === "600"
                        ? "Semi"
                        : w === "700"
                        ? "Bold"
                        : "Black"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size slider */}
            <div className="mb-4">
              <div className="mb-1.5 flex justify-between">
                <span className="text-xs text-zinc-500">Size</span>
                <span className="text-xs font-medium text-zinc-700">
                  {config.fontSize}%
                </span>
              </div>
              <Slider
                min={20}
                max={90}
                step={1}
                value={[config.fontSize]}
                onValueChange={([v]) => update("fontSize", v)}
                className="w-full"
              />
            </div>

            {/* Padding slider */}
            <div>
              <div className="mb-1.5 flex justify-between">
                <span className="text-xs text-zinc-500">Padding</span>
                <span className="text-xs font-medium text-zinc-700">
                  {config.padding}%
                </span>
              </div>
              <Slider
                min={0}
                max={30}
                step={1}
                value={[config.padding]}
                onValueChange={([v]) => update("padding", v)}
                className="w-full"
              />
            </div>
          </Card>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="w-full rounded-2xl border-zinc-200 text-xs font-medium text-zinc-500 hover:text-zinc-900"
          >
            <span className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Reset to default
            </span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}