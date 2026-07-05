"use client";

import { useTheme } from "next-themes";
import { Settings, Monitor, Volume2, Play, Sun, Moon } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, PLAYBACK_SPEEDS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { AppSettings } from "@/types";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { value: settings, setValue: setSettings } = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    {
      theme: "dark",
      autoplay: true,
      defaultQuality: "auto",
      playbackSpeed: 1,
      showCaptions: false,
      volume: 100,
    },
  );

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-500/10">
          <Settings className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your experience
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border bg-card/30 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sun className="h-5 w-5" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred appearance
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTheme("light");
                    updateSetting("theme", "light");
                  }}
                  className="rounded-xl"
                >
                  <Sun className="mr-1 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTheme("dark");
                    updateSetting("theme", "dark");
                  }}
                  className="rounded-xl"
                >
                  <Moon className="mr-1 h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/30 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Play className="h-5 w-5" />
            Playback
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autoplay</p>
                <p className="text-sm text-muted-foreground">
                  Automatically play next video
                </p>
              </div>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) =>
                  updateSetting("autoplay", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default Speed</p>
                <p className="text-sm text-muted-foreground">
                  Preferred playback speed
                </p>
              </div>
              <select
                value={settings.playbackSpeed}
                onChange={(e) =>
                  updateSetting("playbackSpeed", parseFloat(e.target.value))
                }
                className="rounded-xl border bg-background px-3 py-2 text-sm"
              >
                {PLAYBACK_SPEEDS.map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default Volume</p>
                <p className="text-sm text-muted-foreground">
                  Player volume level
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volume}
                  onChange={(e) =>
                    updateSetting("volume", parseInt(e.target.value))
                  }
                  className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-muted accent-purple-500"
                />
                <span className="w-10 text-right text-sm">
                  {settings.volume}%
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Captions</p>
                <p className="text-sm text-muted-foreground">
                  Show captions by default
                </p>
              </div>
              <Switch
                checked={settings.showCaptions}
                onCheckedChange={(checked) =>
                  updateSetting("showCaptions", checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/30 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Monitor className="h-5 w-5" />
            About
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Player</span>
              <span className="font-medium text-foreground">
                YouTube Embedded
              </span>
            </div>
            <div className="flex justify-between">
              <span>Data Source</span>
              <span className="font-medium text-foreground">
                YouTube Data API v3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
