import { Clapperboard, Github, Globe, Shield } from "lucide-react";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg">
            <Clapperboard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">{SITE_NAME}</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {SITE_DESCRIPTION}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card/30 p-6">
            <Globe className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">What is {SITE_NAME}?</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {SITE_NAME} is a premium video streaming platform that lets you
              watch YouTube videos in a beautiful, modern interface. Paste any
              YouTube URL and enjoy an enhanced viewing experience with a
              feature-rich player, dark theme, and powerful organizational tools.
            </p>
          </div>

          <div className="rounded-2xl border bg-card/30 p-6">
            <Shield className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Privacy & Legal</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This application uses the official YouTube Embedded Player API and
              YouTube Data API v3. No user data is collected or stored on our
              servers. All preferences and history are stored locally in your
              browser.
            </p>
          </div>

          <div className="rounded-2xl border bg-card/30 p-6">
            <Github className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Features</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• YouTube URL parsing & video playback</li>
              <li>• Search, trending, and category browsing</li>
              <li>• Watch history & continue watching</li>
              <li>• Favorites & watch later lists</li>
              <li>• Picture-in-Picture & theater mode</li>
              <li>• Keyboard shortcuts & playback controls</li>
              <li>• QR code sharing & thumbnail download</li>
              <li>• Dark/light theme</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card/30 p-6">
            <Clapperboard className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-lg font-semibold">Technology</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Next.js 15 with App Router</li>
              <li>• React 19 & TypeScript</li>
              <li>• Tailwind CSS & Framer Motion</li>
              <li>• YouTube IFrame Player API</li>
              <li>• YouTube Data API v3</li>
              <li>• PWA ready</li>
              <li>• Vercel deployment</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border bg-muted/30 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">
            Getting Started
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Simply paste a YouTube URL into the player on the home page, or
            search for videos using the search bar. All your preferences and
            history are stored locally in your browser.
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>Keyboard shortcut: <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono">Space</kbd> Play/Pause</span>
            <span><kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono">F</kbd> Fullscreen</span>
            <span><kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono">M</kbd> Mute</span>
          </div>
        </div>
      </div>
    </div>
  );
}
