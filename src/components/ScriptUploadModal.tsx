import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { ScriptScene } from "../types";
import { parseTextIntoScenes, SCRIPT_PRESETS } from "../data/scriptData";

interface ScriptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportScenes: (scenes: ScriptScene[], mode: "replace" | "append") => void;
}

export const ScriptUploadModal: React.FC<ScriptUploadModalProps> = ({
  isOpen,
  onClose,
  onImportScenes,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "presets">("upload");
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [detectedScenes, setDetectedScenes] = useState<ScriptScene[]>([]);
  const [importMode, setImportMode] = useState<"replace" | "append">("replace");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileRead = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Strip SRT timestamps if it's an .srt subtitle file
        let cleanText = content;
        if (file.name.endsWith(".srt")) {
          cleanText = content
            .replace(/\d+\r?\n\d\d:\d\d:\d\d[,\.]\d\d\d --> \d\d:\d\d:\d\d[,\.]\d\d\d\r?\n/g, "")
            .replace(/\r?\n\r?\n/g, "\n\n");
        }
        setPastedText(cleanText);
        const parsed = parseTextIntoScenes(cleanText, file.name);
        setDetectedScenes(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  };

  const handlePasteChange = (text: string) => {
    setPastedText(text);
    const parsed = parseTextIntoScenes(text, fileName || "New Script");
    setDetectedScenes(parsed);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = SCRIPT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const scenes: ScriptScene[] = preset.scenes.map((s, idx) => ({
      id: idx + 1,
      title: s.title,
      subtitle: s.subtitle,
      content: s.content,
    }));
    onImportScenes(scenes, "replace");
    onClose();
  };

  const handleConfirmImport = () => {
    if (detectedScenes.length === 0) return;
    onImportScenes(detectedScenes, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>අලුත් Script එකක් එක් කරන්න (Upload / Import Script)</span>
              </h2>
              <p className="text-xs text-stone-400">
                Text file (.txt, .srt, .md) හෝ Preset එකකින් Voiceover ස්ක්‍රිප්ට් ඇතුළත් කරන්න
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "upload"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>File Upload (.txt, .srt)</span>
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "paste"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>පාඨය Paste කරන්න (Direct Text)</span>
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "presets"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sample Presets (IGI Si / En)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === "upload" && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-amber-400 bg-amber-500/10"
                    : "border-stone-700 hover:border-stone-600 bg-stone-950/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.srt,.md,.json,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileRead(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-200">
                    {fileName ? `තෝරාගත් ගොනුව: ${fileName}` : "ගොනුව මෙතැනට Drag කරන්න හෝ Click කරන්න"}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 font-mono">
                    .txt, .srt (Subtitles), .md සහාය දක්වයි
                  </p>
                </div>
              </div>

              {detectedScenes.length > 0 && (
                <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      ස්වයංක්‍රීයව කොටස් {detectedScenes.length} ක් හඳුනාගන්නා ලදී:
                    </span>
                    <span className="text-stone-400">
                      {pastedText.split(/\s+/).filter(Boolean).length} වචන
                    </span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-stone-300 pr-1">
                    {detectedScenes.slice(0, 5).map((s) => (
                      <div
                        key={s.id}
                        className="bg-stone-900/60 p-2 rounded border border-stone-800/80 flex items-center justify-between"
                      >
                        <span className="font-semibold text-amber-400/90 truncate mr-2">
                          #{s.id} {s.title}
                        </span>
                        <span className="text-[11px] text-stone-500 shrink-0">
                          {s.content.slice(0, 45)}...
                        </span>
                      </div>
                    ))}
                    {detectedScenes.length > 5 && (
                      <div className="text-[11px] text-stone-500 text-center italic">
                        + තවත් කොටස් {detectedScenes.length - 5} ක්...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "paste" && (
            <div className="space-y-3">
              <label className="text-xs text-stone-400 block font-medium">
                ඕනෑම සිංහල හෝ ඉංග්‍රීසි පිටපතක් මෙහි Paste කරන්න (Paragraphs හෝ '---' මඟින් කොටස් වෙන් වේ):
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => handlePasteChange(e.target.value)}
                rows={8}
                placeholder="ඔබේ voiceover script එක මෙහි paste කරන්න..."
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3.5 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-sans leading-relaxed resize-y"
              />
              {detectedScenes.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>කොටස් {detectedScenes.length} කට වෙන් කෙරේ</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "presets" && (
            <div className="space-y-3">
              <label className="text-xs text-stone-400 block font-medium">
                පෙර සැකසූ නිදර්ශන ස්ක්‍රිප්ට් (Pre-loaded Examples):
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {SCRIPT_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-900/80 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-100">
                          {preset.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            preset.language === "si"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                              : "bg-blue-950/60 text-blue-400 border border-blue-800/40"
                          }`}
                        >
                          {preset.language === "si" ? "Sinhala" : "English"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        {preset.description} ({preset.scenes.length} Scenes)
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Mode Options (Replace vs Append) */}
          {(activeTab === "upload" || activeTab === "paste") && detectedScenes.length > 0 && (
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-400">ක්‍රමය (Mode):</span>
                <button
                  type="button"
                  onClick={() => setImportMode("replace")}
                  className={`px-2.5 py-1 rounded border transition cursor-pointer ${
                    importMode === "replace"
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold"
                      : "bg-stone-950 border-stone-800 text-stone-400"
                  }`}
                >
                  දැනට ඇති පිටපත වෙනුවට (Replace)
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode("append")}
                  className={`px-2.5 py-1 rounded border transition cursor-pointer ${
                    importMode === "append"
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold"
                      : "bg-stone-950 border-stone-800 text-stone-400"
                  }`}
                >
                  පිටපතේ අගට එක් කරන්න (Append)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700 transition cursor-pointer"
          >
            අවලංගු කරන්න (Cancel)
          </button>
          {(activeTab === "upload" || activeTab === "paste") && (
            <button
              onClick={handleConfirmImport}
              disabled={detectedScenes.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>කොටස් {detectedScenes.length} ඇතුළත් කරන්න (Import)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
