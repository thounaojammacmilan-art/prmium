"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Monitor,
  Settings2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PLAYBACK_SPEEDS } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  setSize: (width: number, height: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  startTime?: number;
}

export function VideoPlayer({
  videoId,
  autoplay = false,
  onEnded,
  onTimeUpdate,
  startTime,
}: VideoPlayerProps) {
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const onEndedRef = useRef(onEnded);
  const autoplayRef = useRef(autoplay);
  const startTimeRef = useRef(startTime);
  const togglePlayRef = useRef<() => void>(() => {});
  const toggleMuteRef = useRef<() => void>(() => {});
  const toggleFullscreenRef = useRef<() => void>(() => {});
  const toggleTheaterModeRef = useRef<() => void>(() => {});
  const seekRelativeRef = useRef<(seconds: number) => void>(() => {});
  const changeVolumeRef = useRef<(delta: number) => void>(() => {});
  onEndedRef.current = onEnded;
  autoplayRef.current = autoplay;
  startTimeRef.current = startTime;

  useEffect(() => {
    if (typeof window.YT === "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript?.parentNode?.insertBefore(tag, firstScript);

      window.onYouTubeIframeAPIReady = () => setApiReady(true);
    } else {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (!apiReady) return;

    const newPlayer = new window.YT.Player(`player-${videoId}`, {
      videoId,
      playerVars: {
        autoplay: autoplayRef.current ? 1 : 0,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        start: startTimeRef.current || 0,
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          if (autoplayRef.current) {
            event.target.playVideo();
          }
          setDuration(event.target.getDuration());
          if (startTimeRef.current) {
            event.target.seekTo(startTimeRef.current, true);
          }
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          if (event.data === window.YT.PlayerState.ENDED) {
            onEndedRef.current?.();
          }
        },
      },
    });

    return () => {
      newPlayer?.destroy();
    };
  }, [apiReady, videoId]);

  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      try {
        const time = player.getCurrentTime();
        const dur = player.getDuration();
        setCurrentTime(time);
        setDuration(dur);
        onTimeUpdate?.(time, dur);
      } catch {
        // player may not be ready
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player, onTimeUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlayRef.current();
          break;
        case "f":
          toggleFullscreenRef.current();
          break;
        case "m":
          toggleMuteRef.current();
          break;
        case "t":
          toggleTheaterModeRef.current();
          break;
        case "arrowleft":
          e.preventDefault();
          seekRelativeRef.current(-5);
          break;
        case "arrowright":
          e.preventDefault();
          seekRelativeRef.current(5);
          break;
        case "arrowup":
          e.preventDefault();
          changeVolumeRef.current(10);
          break;
        case "arrowdown":
          e.preventDefault();
          changeVolumeRef.current(-10);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  const toggleMute = useCallback(() => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }, [player, isMuted]);

  const changeVolume = useCallback(
    (delta: number) => {
      if (!player) return;
      const newVol = Math.min(100, Math.max(0, volume + delta));
      player.setVolume(newVol);
      setVolume(newVol);
      if (newVol > 0 && isMuted) {
        player.unMute();
        setIsMuted(false);
      }
    },
    [player, volume, isMuted],
  );

  const seekRelative = useCallback(
    (seconds: number) => {
      if (!player) return;
      const newTime = Math.min(
        Math.max(0, currentTime + seconds),
        duration,
      );
      player.seekTo(newTime, true);
    },
    [player, currentTime, duration],
  );

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!player) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const time = pos * duration;
      player.seekTo(time, true);
    },
    [player, duration],
  );

  const changeSpeed = useCallback(
    (speed: number) => {
      if (!player) return;
      player.setPlaybackRate(speed);
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    },
    [player],
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode((prev) => !prev);
  }, []);

  togglePlayRef.current = togglePlay;
  toggleMuteRef.current = toggleMute;
  toggleFullscreenRef.current = toggleFullscreen;
  toggleTheaterModeRef.current = toggleTheaterMode;
  seekRelativeRef.current = seekRelative;
  changeVolumeRef.current = changeVolume;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={`group relative ${isTheaterMode ? "max-w-full" : "max-w-5xl"} mx-auto overflow-hidden rounded-2xl bg-black`}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <div
          ref={playerContainerRef}
          className="relative aspect-video w-full"
        >
          <div
            id={`player-${videoId}`}
            className="h-full w-full"
          />

          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              >
                <Button
                  onClick={togglePlay}
                  size="icon"
                  className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/30"
                >
                  <Play className="h-8 w-8 fill-white text-white" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12"
              >
                <div className="space-y-2">
                  <div
                    className="relative h-1.5 cursor-pointer rounded-full bg-white/20 transition-all hover:h-2"
                    onClick={handleSeek}
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-md"
                      style={{ left: `${progress}%`, marginLeft: "-8px" }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={togglePlay}
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Play/Pause (Space)</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={() => seekRelative(-10)}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rewind 10s</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={() => seekRelative(10)}
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Forward 10s</TooltipContent>
                      </Tooltip>

                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                              onClick={toggleMute}
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="h-5 w-5" />
                              ) : (
                                <Volume2 className="h-5 w-5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mute (M)</TooltipContent>
                        </Tooltip>
                        <div className="hidden w-20 sm:block">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setVolume(val);
                              player?.setVolume(val);
                              if (val > 0 && isMuted) {
                                player?.unMute();
                                setIsMuted(false);
                              }
                            }}
                            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-purple-500 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          />
                        </div>
                      </div>

                      <span className="ml-2 text-xs font-medium text-white/80">
                        {formatDuration(Math.floor(currentTime))} /{" "}
                        {formatDuration(Math.floor(duration))}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Speed</TooltipContent>
                        </Tooltip>
                        <AnimatePresence>
                          {showSpeedMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="absolute bottom-full right-0 mb-2 w-36 rounded-2xl border bg-background/80 backdrop-blur-2xl p-1.5 shadow-xl"
                            >
                              {PLAYBACK_SPEEDS.map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => changeSpeed(speed)}
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                                    playbackSpeed === speed
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                  }`}
                                >
                                  <span>{speed}x</span>
                                  {playbackSpeed === speed && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={toggleTheaterMode}
                          >
                            <Monitor className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Theater mode (T)</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={toggleFullscreen}
                          >
                            {isFullscreen ? (
                              <Minimize className="h-4 w-4" />
                            ) : (
                              <Maximize className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Fullscreen (F)</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
