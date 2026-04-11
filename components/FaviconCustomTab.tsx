"use client";

import { useRef, useState } from "react";
import { Upload, ImageIcon, Type, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CustomContent =
  | { type: "svg"; svgString: string; name: string }
  | { type: "image"; dataUrl: string; name: string }
  | { type: "font"; fontFamily: string; fontDataUrl: string; name: string }
  | null;

interface Props {
  customContent: CustomContent;
  customText: string;
  onCustomContentChange: (c: CustomContent) => void;
  onCustomTextChange: (t: string) => void;
}

export function FaviconCustomTab({
  customContent,
  customText,
  onCustomContentChange,
  onCustomTextChange,
}: Props) {
  const svgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSVG = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".svg")) {
      setError("Please upload a valid .svg file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onCustomContentChange({
        type: "svg",
        svgString: text,
        name: file.name,
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Supported formats: PNG, JPG, WebP, GIF.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onCustomContentChange({
        type: "image",
        dataUrl: ev.target?.result as string,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFont = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [".ttf", ".otf", ".woff", ".woff2"];
    const valid = allowed.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!valid) {
      setError("Supported font formats: TTF, OTF, WOFF, WOFF2.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const fontFamily = `custom-font-${Date.now()}`;
      // Register font
      const style = document.createElement("style");
      style.textContent = `@font-face { font-family: '${fontFamily}'; src: url('${dataUrl}'); }`;
      document.head.appendChild(style);
      onCustomContentChange({
        type: "font",
        fontFamily,
        fontDataUrl: dataUrl,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clear = () => {
    onCustomContentChange(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
          {error}
        </div>
      )}

      {/* Active content badge */}
      {customContent && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-900">
              {customContent.type === "font" ? (
                <Type className="h-3 w-3 text-white" strokeWidth={2.5} />
              ) : (
                <ImageIcon className="h-3 w-3 text-white" strokeWidth={2.5} />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-800">
                {customContent.name}
              </p>
              <p className="text-[10px] text-zinc-400 capitalize">
                {customContent.type} loaded
              </p>
            </div>
          </div>
          <button
            onClick={clear}
            className="ml-2 flex-shrink-0 rounded-lg px-2 py-1 text-[10px] font-medium text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition"
          >
            Remove
          </button>
        </div>
      )}

      {/* Custom font text input — only when font is loaded */}
      {customContent?.type === "font" && (
        <div>
          <p className="mb-1.5 text-xs text-zinc-500">
            Text to render with your font
          </p>
          <input
            type="text"
            value={customText}
            maxLength={2}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="F"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-2xl font-bold tracking-tight text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            style={{
              fontFamily: customContent.fontFamily,
            }}
          />
          <p className="mt-1.5 text-center text-xs text-zinc-400">
            Up to 2 characters — rendered with your custom font
          </p>
        </div>
      )}

      {/* Upload buttons */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500 font-medium">Upload options</p>

        {/* SVG upload */}
        <button
          onClick={() => svgInputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-white"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Upload className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-800">Upload SVG</p>
            <p className="text-[10px] text-zinc-400">
              Vector icon — scales perfectly
            </p>
          </div>
        </button>

        {/* Image upload */}
        <button
          onClick={() => imgInputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-white"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
            <ImageIcon
              className="h-3.5 w-3.5 text-zinc-500"
              strokeWidth={2}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-800">Upload Image</p>
            <p className="text-[10px] text-zinc-400">
              PNG, JPG, WebP — auto-resized
            </p>
          </div>
        </button>

        {/* Font upload */}
        <button
          onClick={() => fontInputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-white"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Type className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-800">Upload Font</p>
            <p className="text-[10px] text-zinc-400">
              TTF, OTF, WOFF, WOFF2 — custom typography
            </p>
          </div>
        </button>
      </div>

      <input
        ref={svgInputRef}
        type="file"
        accept=".svg"
        className="hidden"
        onChange={handleSVG}
      />
      <input
        ref={imgInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleImage}
      />
      <input
        ref={fontInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={handleFont}
      />
    </div>
  );
}