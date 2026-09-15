import React, { useState } from "react";
import {
  Mic,
  Sliders,
  Play,
  Loader2,
  Sparkles,
  CheckCircle2,
  Plus,
  RotateCcw,
  Edit3,
} from "lucide-react";
import { VOICE_OPTIONS, STYLE_OPTIONS } from "../data/scriptData";
import { SupportedLanguage } from "../types";

interface VoiceSettingsProps {
  language: SupportedLanguage;
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  autoPlayNext: boolean;
  onAutoPlayToggle: (enabled: boolean) => void;
  customStylePrompt: string;
  onCustomStyleChange: (val: string) => void;
  onAddNewScene: () => void;
  onResetScript: () => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  language,
  selectedVoice,
  onVoiceChange,
  selectedStyle,
  onStyleChange,
  autoPlayNext,
  onAutoPlayToggle,
  customStylePrompt,
  onCustomStyleChange,
  onAddNewScene,
  onResetScript,
}) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [showCustomPromptInput, setShowCustomPromptInput] = useState(false);

  // Filter styles relevant to the active language or 'all'
  const filteredStyles = STYLE_OPTIONS.filter(
    (s) => s.language === "all" || s.language === language
  );

  const handleTestVoice = async () => {
    if (isPreviewing) return;
    try {
      setIsPreviewing(true);
      if (previewAudio) {
        previewAudio.pause();
      }

      const activeStyleObj = STYLE_OPTIONS.find((s) => s.id === selectedStyle);
      const stylePrompt = customStylePrompt || activeStyleObj?.promptPrefix || "";

      const sampleText =
        language === "si"
          ? "Project IGI tactical shooting game එකට සාදරයෙන් පිළිගන්නවා! I'm going in."
          : "Welcome back operatives. Tactical reconnaissance confirmed. I'm going in!";

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sampleText,
          voice: selectedVoice,
          stylePrompt,
          language,
        }),
      });

      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        setPreviewAudio(audio);
        audio.play();
        audio.onended = () => setIsPreviewing(false);
        audio.onerror = () => setIsPreviewing(false);
      } else {
        setIsPreviewing(false);
      }
    } catch (e) {
      console.error("Failed to preview voice", e);
      setIsPreviewing(false);
    }
  };

  return (
    <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-stone-200">
            Voice & Delivery Settings (හඬ සහ ශෛලිය)
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
            {language === "si" ? "සිංහල මාදිලිය" : "English Mode"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-scene-top"
            onClick={onAddNewScene}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition cursor-pointer"
            title="අලුත් Scene එකක් ලියන්න"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Scene</span>
          </button>

          <button
            id="btn-reset-script"
            onClick={onResetScript}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition cursor-pointer"
            title="පෙරනිමි Script එකට Reset කරන්න"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            id="btn-test-voice"
            onClick={handleTestVoice}
            disabled={isPreviewing}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer disabled:opacity-50"
          >
            {isPreviewing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span>හඬ වාදනය වේ...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Test Voice Sample</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Voice Selection */}
        <div className="lg:col-span-7 space-y-2">
          <label className="text-xs font-medium text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>තෝරාගත් හඬ (Gemini 3.1 Flash Voices)</span>
            </span>
            <span className="text-[11px] text-stone-500 font-mono">
              8 Available Voices
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VOICE_OPTIONS.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              return (
                <button
                  key={voice.id}
                  id={`voice-opt-${voice.id.toLowerCase()}`}
                  onClick={() => onVoiceChange(voice.id)}
                  className={`text-left p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500/70 text-white shadow-sm ring-1 ring-amber-500/30"
                      : "bg-stone-950/50 border-stone-800 hover:border-stone-700 text-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-stone-100 flex items-center gap-1.5">
                      {voice.name}
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-800/90 text-stone-400 border border-stone-700/50">
                      {voice.gender}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                    {voice.description}
                  </span>
                  <div className="mt-1.5 pt-1.5 border-t border-stone-800/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400/90 font-medium">{voice.vibe}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Selection & Direction */}
        <div className="lg:col-span-5 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>කථන ශෛලිය (Delivery Style)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomPromptInput(!showCustomPromptInput)}
                className="text-[11px] text-amber-400/90 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{showCustomPromptInput ? "Hide Custom" : "Custom Prompt"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredStyles.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    id={`style-opt-${style.id}`}
                    onClick={() => onStyleChange(style.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/70 text-white font-medium"
                        : "bg-stone-950/50 border-stone-800 hover:border-stone-700 text-stone-300"
                    }`}
                  >
                    <div className="font-semibold text-stone-200 text-xs">
                      {language === "si" ? style.sinhalaName : style.name}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5 leading-tight line-clamp-1">
                      {language === "si" ? style.sinhalaDescription : style.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Voice Direction Input */}
            {showCustomPromptInput && (
              <div className="pt-2">
                <input
                  type="text"
                  value={customStylePrompt}
                  onChange={(e) => onCustomStyleChange(e.target.value)}
                  placeholder="Custom voice direction (e.g. Speak with intense whisper...)"
                  className="w-full bg-stone-950 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            )}
          </div>

          {/* Continuous Playback toggle */}
          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-stone-200">
                ස්වයංක්‍රීයව ඊළඟ කොටස වාදනය (Auto-Play Next)
              </div>
              <div className="text-[11px] text-stone-400">
                කොටසක් අවසන් වූ විට මීළඟ කොටස එක දිගට ශ්‍රවණය කරන්න
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-autoplay"
                type="checkbox"
                checked={autoPlayNext}
                onChange={(e) => onAutoPlayToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
