import React from "react";
import {
  Radio,
  Sparkles,
  Volume2,
  ShieldCheck,
  Upload,
  Archive,
  Globe,
  Loader2,
} from "lucide-react";
import { SupportedLanguage } from "../types";

interface TacticalHeaderProps {
  totalScenes: number;
  generatedCount: number;
  totalDurationSeconds: number;
  isBatchGenerating: boolean;
  isZipping: boolean;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onGenerateAll: () => void;
  onOpenUpload: () => void;
  onOpenVercelGuide: () => void;
  onDownloadZip: () => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  totalScenes,
  generatedCount,
  totalDurationSeconds,
  isBatchGenerating,
  isZipping,
  language,
  onLanguageChange,
  onGenerateAll,
  onOpenUpload,
  onOpenVercelGuide,
  onDownloadZip,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono tracking-wider text-amber-400 uppercase bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                  PROJECT IGI • VOICEOVER STUDIO
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Gemini 3.1 Flash TTS
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
                <span>AI Voiceover Studio</span>
                <span className="text-xs font-normal text-stone-400 hidden sm:inline-block">
                  (සිංහල & English හඬකැවීම්)
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Language Toggle on Mobile */}
          <div className="lg:hidden flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => onLanguageChange("si")}
              className={`px-2 py-1 rounded transition ${
                language === "si"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "text-stone-400"
              }`}
            >
              සිංහල
            </button>
            <button
              onClick={() => onLanguageChange("en")}
              className={`px-2 py-1 rounded transition ${
                language === "en"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "text-stone-400"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Action Controls & Vercel Button */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Language Selector (Desktop) */}
          <div className="hidden lg:flex items-center bg-stone-900 border border-stone-800 rounded-lg p-1 text-xs font-medium">
            <div className="flex items-center gap-1 px-1.5 text-stone-400 text-[11px]">
              <Globe className="w-3 h-3" />
              <span>භාෂාව:</span>
            </div>
            <button
              id="btn-lang-si"
              onClick={() => onLanguageChange("si")}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                language === "si"
                  ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              සිංහල (Sinhala)
            </button>
            <button
              id="btn-lang-en"
              onClick={() => onLanguageChange("en")}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                language === "en"
                  ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              English
            </button>
          </div>

          {/* Upload Script Button */}
          <button
            id="btn-open-upload-modal"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
            title="අලුත් Script file එකක් Upload කරන්න (.txt, .srt, .md)"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Script</span>
          </button>

          {/* Vercel Host Button */}
          <button
            id="btn-open-vercel-guide"
            onClick={onOpenVercelGuide}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
            title="Vercel එකට Deploy කරන ආකාරය"
          >
            <span className="font-bold text-white text-[11px]">▲</span>
            <span>Vercel Deploy</span>
          </button>

          {/* Audio Stats */}
          <div className="flex items-center gap-1.5 bg-stone-900/90 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-mono">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold">
              {generatedCount}/{totalScenes}
            </span>
            {totalDurationSeconds > 0 && (
              <>
                <span className="text-stone-600">|</span>
                <span className="text-stone-300">{formatTime(totalDurationSeconds)}</span>
              </>
            )}
          </div>

          {/* Download All as ZIP */}
          {generatedCount > 0 && (
            <button
              id="btn-download-zip"
              onClick={onDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              title="සියලුම WAV Clips එකවර ZIP ගොනුවක් ලෙස බාගන්න"
            >
              {isZipping ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Archive className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="hidden sm:inline">ZIP බාගන්න (All WAV)</span>
              <span className="sm:hidden">ZIP</span>
            </button>
          )}

          {/* Voice All Scenes batch action */}
          <button
            id="btn-generate-all"
            onClick={onGenerateAll}
            disabled={isBatchGenerating}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-bold px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition shadow-md shadow-amber-500/10 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isBatchGenerating ? "animate-spin" : ""}`} />
            <span>
              {isBatchGenerating
                ? "හඬ සැකසෙමින්..."
                : generatedCount === totalScenes
                ? "සියල්ල නැවත (Re-voice)"
                : "සියල්ල වොයිස් කරන්න (Voice All)"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
