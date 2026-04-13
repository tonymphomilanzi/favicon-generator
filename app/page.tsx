import FaviconGenerator from "@/components/FaviconGenerator";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
   Package,
  Monitor,
  ClipboardList,
  Zap,
  Smartphone,
  Palette,
  Upload,
  Type,
  FileImage,
  Check,
  Coffee,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
  {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          
          {/* Logo + Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900">
              <span className="text-xs font-bold text-white">F</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-zinc-900">
                FaviconKit
              </span>
              <span className="text-[10px] text-zinc-400">
                Generate favicons instantly
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden items-center gap-6 text-sm text-zinc-500 md:flex">
            <a href="#features" className="transition hover:text-zinc-900">
              Features
            </a>
            <a href="#how" className="transition hover:text-zinc-900">
              How it works
            </a>
            <a href="#faq" className="transition hover:text-zinc-900">
              FAQ
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            
           

            {/* CTA */}
            <a
              href="#generator"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              Generate
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 text-center">
       
        <h1 className="text-balance text-5xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Generate a favicon that
          <br />
          <span className="text-zinc-400">actually looks good</span>
        </h1>
        <p className="mt-4 text-balance text-base text-zinc-500">
         Create a complete favicon package in seconds — no design skills needed.
        </p>

        {/* Trust bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        {/**   {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 text-xs text-zinc-400"
            >
              <Check className="h-3.5 w-3.5 text-zinc-400" strokeWidth={2.5} />
              <span>{item.label}</span>
            </div>
          ))}**/}
        </div>
      </section>

      {/* Tool */}
      <section id="generator" className="mx-auto max-w-6xl px-6 pb-24">
        <FaviconGenerator />
      </section>

      {/* Value Props */}
      <section id="features"  className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-zinc-900">
            Everything included, nothing missing
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            Most generators give you one PNG. We give you the full package.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-zinc-100 bg-zinc-50 p-6 transition-all hover:border-zinc-200 hover:bg-white hover:shadow-sm"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition-colors group-hover:border-zinc-300">
                  <f.icon
                    className="h-4 w-4 text-zinc-600"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-zinc-900">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-zinc-900">
            How it works
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            Three steps, under 60 seconds.
          </p>
          <div className="relative space-y-0">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">
                    <span className="text-xs font-semibold text-zinc-700">
                      {i + 1}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-zinc-200" />
                  )}
                </div>
                <div className={`pb-8 pt-1 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <p className="mb-1 text-sm font-semibold text-zinc-900">
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-zinc-900">
            Frequently asked questions
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            Everything you need to know about favicons and FaviconKit.
          </p>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">{faq.a}</p>
                {i < faqs.length - 1 && (
                  <Separator className="mt-6 bg-zinc-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900">
                <span className="text-[10px] font-bold text-white">F</span>
              </div>
              <span className="text-xs font-semibold text-zinc-600">
                FaviconKit
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} &nbsp; FaviconKit ·
            </p>

            {/* Coffee in footer too */}
            <a
            href="https://ko-fi.com/tonymphomilanzi"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-100 hover:shadow-md"
          >
            <Coffee
              className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover:rotate-12"
              strokeWidth={2}
            />
           Buy me a coffee
          </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const trustItems = [
  { label: "No signup required" },
  { label: "Nothing uploaded to servers" },
  { label: "8 sizes generated" },
  { label: "HTML snippet included" },
  { label: "PWA manifest included" },
];

const features = [
  {
    icon: Package,
    title: "Complete ZIP package",
    description:
      "Download all sizes at once — 16×16, 32×32, 180×180 Apple Touch, 192×192 and 512×512 Android icons, plus a favicon.ico — all in one click.",
  },
  {
    icon: Monitor,
    title: "Browser tab preview",
    description:
      "See exactly how your favicon looks in a real browser tab before downloading. Light and dark mode preview included.",
  },
  {
    icon: ClipboardList,
    title: "Copy-paste HTML snippet",
    description:
      "Get the exact code to paste into your head tag. Includes theme-color meta and manifest link — nothing to figure out.",
  },
  {
    icon: Zap,
    title: "100% client-side",
    description:
      "Nothing is uploaded to any server. Your favicon is generated instantly in your browser using the Canvas API — your files never leave your device.",
  },
  {
    icon: Smartphone,
    title: "PWA manifest included",
    description:
      "site.webmanifest is generated and included in your ZIP automatically, so your site is Progressive Web App ready out of the box.",
  },
  {
    icon: Palette,
    title: "Gradients and transparency",
    description:
      "Solid colors, linear gradients with presets, transparent backgrounds — your favicon adapts to any browser theme.",
  },
  {
    icon: Upload,
    title: "Custom SVG & image upload",
    description:
      "Upload your own SVG logo, PNG, JPG, or WebP image and it will be auto-resized and embedded into every favicon size perfectly.",
  },
  {
    icon: Type,
    title: "Custom font upload",
    description:
      "Upload your own TTF, OTF, WOFF, or WOFF2 font file and render your initials or brand mark in your exact typography.",
  },
  {
    icon: FileImage,
    title: "ICO format export",
    description:
      "Legacy ICO format is included in every download — a multi-resolution favicon.ico containing 16×16, 32×32, and 48×48 frames for maximum browser compatibility.",
  },
];

const steps = [
  {
    title: "Choose your content type",
    description:
      "Type one or two characters, pick a clean unicode symbol, or go fully custom — upload your own SVG logo, image, or brand font. No design software needed.",
  },
  {
    title: "Customize colors, shape, and style",
    description:
      "Choose a solid color, gradient, or transparent background. Pick your shape — square, rounded, or circle. Adjust size and padding with sliders. Upload a custom font to render your text in your exact typography.",
  },
  {
    title: "Download your complete package",
    description:
      "Get a ZIP with 8 PNG files, a favicon.ico (16, 32, 48px multi-resolution), a site.webmanifest, a ready-to-paste HTML snippet, and a README with step-by-step instructions.",
  },
];

const faqs = [
  {
    q: "What is a favicon?",
    a: "A favicon is the small icon that appears in your browser tab, bookmarks bar, and on mobile home screens when a user saves your site. It is one of the first brand touchpoints visitors notice and helps your site look professional and trustworthy.",
  },
  {
    q: "What sizes do I need for full browser and device support?",
    a: "At minimum you need 16x16 and 32x32 for desktop browsers, 180x180 for Apple devices, and 192x192 and 512x512 for Android and PWA support. FaviconKit generates all of these plus 48x48, 64x64, and 96x96 for maximum compatibility.",
  },
  {
    q: "Can I upload my own logo or brand icon?",
    a: "Yes. Switch to the Custom tab and upload any SVG, PNG, JPG, or WebP file. FaviconKit will auto-resize and crop your image to fit every favicon size correctly, with shape clipping applied so it matches your chosen style.",
  },
  {
    q: "Can I use my own custom font?",
    a: "Yes. Upload any TTF, OTF, WOFF, or WOFF2 font file in the Custom tab and your text will be rendered using that exact typeface across all favicon sizes. The font is loaded entirely in your browser — nothing is sent to a server.",
  },
  {
    q: "What is favicon.ico and do I need it?",
    a: "ICO is the legacy favicon format supported by all browsers including very old versions of Internet Explorer. FaviconKit generates a multi-resolution favicon.ico containing 16×16, 32×32, and 48×48 frames and includes it in every download for maximum compatibility.",
  },
  {
    q: "How do I add the favicon to my website?",
    a: "Copy the HTML snippet shown after generating your favicon and paste it inside the head tag of your HTML. Then upload all the files from the ZIP to your website root directory — the same folder as your index.html.",
  },
  {
    q: "Does this work with Next.js, WordPress, Webflow, or Shopify?",
    a: "Yes. The generated files are standard web assets that work with any platform or framework. The README inside your ZIP includes specific instructions for Next.js, WordPress, and Webflow.",
  },
  {
    q: "What is site.webmanifest and do I need it?",
    a: "The web manifest is a JSON file that tells browsers about your app — its name, icon, and theme color. It is required for Progressive Web App support and for Android devices to show your icon correctly on the home screen. FaviconKit generates it automatically.",
  },
  {
    q: "Is it really completely free?",
    a: "Yes. No account, no watermark, no usage limits, no strings. Generate as many favicons as you need. Everything runs in your browser so there are no server costs to pass on.",
  },
  {
    q: "What is the difference between ICO and PNG favicons?",
    a: "ICO is the legacy format supported by all browsers including very old versions of Internet Explorer. PNG is the modern standard supported by all current browsers. FaviconKit generates both — PNG files for modern browsers and a favicon.ico for legacy support — so you are covered in every scenario.",
  },
];