import React, { useRef, useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Volume2,
  VolumeX,
  Gauge,
} from "lucide-react";
import { ScriptScene } from "../types";

interface AudioPlayerProps {
  currentScene: ScriptScene | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onEnded: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentScene,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onEnded,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !currentScene?.audioUrl) return;

    audioRef.current.src = currentScene.audioUrl;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback interrupted:", err));
    }
  }, [currentScene?.audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback start error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentScene?.durationSeconds || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  const handleDownload = () => {
    if (!currentScene?.audioUrl) return;
    const a = document.createElement("a");
    a.href = currentScene.audioUrl;
    a.download = `Project_IGI_Scene_${currentScene.id}_Voiceover.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return "0:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!currentScene || !currentScene.audioUrl) {
    return null;
  }

  return (
    <aside
      aria-label="Audio Playback Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-stone-800 shadow-2xl backdrop-blur-lg px-4 py-3"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track info & Simulated equalizer */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <div className="flex items-end gap-0.5 h-5">
              <span
                className={`w-1 bg-amber-400 rounded-t transition-all ${
                  isPlaying ? "animate-pulse h-5" : "h-1.5"
                }`}
              />
              <span
                className={`w-1 bg-amber-400 rounded-t transition-all delay-75 ${
                  isPlaying ? "animate-pulse h-3.5" : "h-2.5"
                }`}
              />
              <span
                className={`w-1 bg-amber-400 rounded-t transition-all delay-150 ${
                  isPlaying ? "animate-pulse h-4.5" : "h-1"
                }`}
              />
              <span
                className={`w-1 bg-amber-400 rounded-t transition-all delay-100 ${
                  isPlaying ? "animate-pulse h-2" : "h-3"
                }`}
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-mono text-amber-400/90 font-medium truncate">
              Scene {currentScene.id} • {currentScene.title}
            </div>
            <div className="text-xs text-stone-300 truncate font-sinhala">
              {currentScene.subtitle}
            </div>
          </div>
        </div>

        {/* Playback Controls & Progress */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/5">
          <div className="flex items-center gap-4">
            <button
              id="btn-prev-scene"
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
              title="කලින් කොටස (Previous)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="btn-play-pause-main"
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 cursor-pointer transition transform active:scale-95"
              title={isPlaying ? "නවතන්න (Pause)" : "වාදනය කරන්න (Play)"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-stone-950" />
              ) : (
                <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
              )}
            </button>

            <button
              id="btn-next-scene"
              onClick={onNext}
              disabled={!hasNext}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition"
              title="ඊළඟ කොටස (Next)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Time & Scrubber */}
          <div className="w-full flex items-center gap-2 text-xs font-mono text-stone-400">
            <span className="w-10 text-right">{formatSeconds(currentTime)}</span>
            <input
              id="audio-progress-slider"
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="w-10">{formatSeconds(duration)}</span>
          </div>
        </div>

        {/* Utility controls: Speed, Mute, Download */}
        <div className="flex items-center justify-end gap-2 w-full md:w-1/3">
          <button
            id="btn-speed-toggle"
            onClick={cycleSpeed}
            className="flex items-center gap-1 px-2 py-1 text-xs font-mono rounded bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 transition cursor-pointer"
            title="වේගය (Speed)"
          >
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>{playbackRate}x</span>
          </button>

          <button
            id="btn-mute-toggle"
            onClick={toggleMute}
            className="p-1.5 rounded bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 transition cursor-pointer"
            title={isMuted ? "ශබ්දය සක්‍රිය කරන්න" : "නිහඬ කරන්න"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          <button
            id="btn-download-wav"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition cursor-pointer"
            title="WAV ශ්‍රව්‍ය ගොනුව බාගන්න"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>WAV බාගන්න</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
