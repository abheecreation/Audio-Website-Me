import React, { useState } from "react";
import {
  Play,
  Pause,
  Sparkles,
  Download,
  Clock,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Edit3,
  Trash2,
  Copy,
  Volume2,
} from "lucide-react";
import { ScriptScene } from "../types";

interface SceneCardProps {
  scene: ScriptScene;
  isActive: boolean;
  isPlaying: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onPlay: () => void;
  onGenerate: () => void;
  onUpdateContent: (newContent: string, newTitle?: string) => void;
  onDeleteScene: () => void;
  onDuplicateScene: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  isActive,
  isPlaying,
  canDelete,
  onSelect,
  onPlay,
  onGenerate,
  onUpdateContent,
  onDeleteScene,
  onDuplicateScene,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(scene.title);
  const [editContent, setEditContent] = useState(scene.content);

  const wordCount = scene.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = scene.content.length;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!scene.audioUrl) return;
    const a = document.createElement("a");
    a.href = scene.audioUrl;
    const safeTitle = scene.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    a.download = `Scene_${scene.id}_${safeTitle}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateContent(editContent, editTitle);
    setIsEditing(false);
  };

  return (
    <div
      id={`scene-card-${scene.id}`}
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isActive
          ? "bg-stone-900/90 border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20"
          : "bg-stone-900/40 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60"
      }`}
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 border-b border-stone-800/80 flex items-center justify-between gap-2 bg-stone-950/50">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="w-6 h-6 rounded-md bg-stone-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-stone-700 shrink-0">
            {scene.id}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-stone-100 truncate">
              {scene.title}
            </h3>
            <p className="text-[11px] text-stone-400 truncate">
              {scene.subtitle || `Scene #${scene.id}`}
            </p>
          </div>
        </div>

        {/* Status indicator & Scene control tools */}
        <div className="flex items-center gap-1.5 shrink-0">
          {scene.audioUrl ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3" />
              <span>{scene.durationSeconds ? `${scene.durationSeconds}s` : "WAV"}</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono text-stone-500 bg-stone-800/60 px-2 py-0.5 rounded-md">
              හඬකැවී නැත
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateScene();
            }}
            className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
            title="Duplicate Scene (පිටපතක් ගන්න)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteScene();
              }}
              className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
              title="Scene එක මකන්න (Delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Text Content */}
      <div className="p-4 space-y-3">
        {isEditing ? (
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                Scene මාතෘකාව (Title):
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                Voiceover පිටපත (Script text):
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-sans leading-relaxed resize-y"
                placeholder="පාඨය මෙහි යොදන්න..."
              />
            </div>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTitle(scene.title);
                  setEditContent(scene.content);
                  setIsEditing(false);
                }}
                className="px-2.5 py-1 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer"
              >
                සුරකින්න (Save)
              </button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line font-sans line-clamp-5 group-hover:line-clamp-none transition-all">
              {scene.content}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditTitle(scene.title);
                setEditContent(scene.content);
                setIsEditing(true);
              }}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 text-xs bg-stone-800 text-stone-300 hover:text-white rounded-md border border-stone-700 transition cursor-pointer flex items-center gap-1 shadow-sm"
              title="පාඨය සංස්කරණය කරන්න"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
        )}

        {/* Audio Visualizer Wave bar if playing */}
        {isPlaying && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <div className="flex items-center gap-0.5 flex-1 h-3 overflow-hidden">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 85, 60, 40, 90, 75, 45, 80].map(
                (h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-amber-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${(i % 5) * 120}ms`,
                    }}
                  />
                )
              )}
            </div>
            <span className="text-[11px] font-mono text-amber-400">Playing...</span>
          </div>
        )}

        {/* Error Notification */}
        {scene.error && (
          <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-950/30 border border-rose-800/40 p-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{scene.error}</span>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="pt-2 border-t border-stone-800/70 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-3 text-stone-400 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-stone-500" />
              {wordCount} වචන
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" />
              ~{Math.ceil(wordCount / 2.5)}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            {scene.audioUrl && (
              <>
                <button
                  type="button"
                  id={`btn-play-scene-${scene.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                    isPlaying
                      ? "bg-amber-500 text-stone-950"
                      : "bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-stone-950" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play WAV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id={`btn-download-scene-${scene.id}`}
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition cursor-pointer"
                  title="WAV ශ්‍රව්‍ය ගොනුව බාගන්න"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </>
            )}

            <button
              type="button"
              id={`btn-voice-scene-${scene.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              disabled={scene.isGenerating}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed ${
                scene.isGenerating
                  ? "bg-stone-800 text-stone-400 border border-stone-700"
                  : scene.audioUrl
                  ? "bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                  : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/10"
              }`}
            >
              {scene.isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>හඬ සැකසේ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {scene.audioUrl ? "නැවත වොයිස් කරන්න" : "වොයිස් කරන්න (Voice)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
