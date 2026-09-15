import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import {
  INITIAL_SINHALA_SCENES,
  INITIAL_ENGLISH_SCENES,
  STYLE_OPTIONS,
} from "./data/scriptData";
import { ScriptScene, SupportedLanguage } from "./types";
import { TacticalHeader } from "./components/TacticalHeader";
import { VoiceSettings } from "./components/VoiceSettings";
import { SceneCard } from "./components/SceneCard";
import { AudioPlayer } from "./components/AudioPlayer";
import { ScriptUploadModal } from "./components/ScriptUploadModal";
import { VercelDeployModal } from "./components/VercelDeployModal";
import {
  Sparkles,
  BookOpen,
  ListOrdered,
  Download,
  AlertCircle,
  Plus,
  CheckCircle2,
  Upload,
} from "lucide-react";

export default function App() {
  // Language selection: Sinhala ('si') or English ('en')
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("igi_studio_lang");
    return (saved as SupportedLanguage) || "si";
  });

  // Scenes state
  const [scenes, setScenes] = useState<ScriptScene[]>(() => {
    try {
      const saved = localStorage.getItem("igi_studio_scenes_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SINHALA_SCENES;
  });

  const [activeSceneId, setActiveSceneId] = useState<number>(1);
  const [playingSceneId, setPlayingSceneId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [selectedVoice, setSelectedVoice] = useState<string>("Puck");
  const [selectedStyle, setSelectedStyle] = useState<string>(
    language === "si" ? "gaming_si" : "gaming_en"
  );
  const [customStylePrompt, setCustomStylePrompt] = useState<string>("");
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);

  // Batch generation & ZIP states
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // View mode
  const [viewMode, setViewMode] = useState<"cards" | "full">("cards");
  const [fullScriptAudio, setFullScriptAudio] = useState<{
    audioUrl?: string;
    durationSeconds?: number;
    isGenerating?: boolean;
    error?: string;
  }>({});

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);

  // Save scenes & language to localStorage
  useEffect(() => {
    try {
      // Don't save large audio dataUrls to localStorage to avoid exceeding quotas; save script structure
      const liteScenes = scenes.map(({ audioUrl, ...rest }) => rest);
      localStorage.setItem("igi_studio_scenes_v2", JSON.stringify(liteScenes));
    } catch (e) {
      console.warn("Could not save scenes to localStorage", e);
    }
  }, [scenes]);

  useEffect(() => {
    localStorage.setItem("igi_studio_lang", language);
  }, [language]);

  // Handle language switch
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    if (newLang === language) return;
    setLanguage(newLang);
    setSelectedStyle(newLang === "si" ? "gaming_si" : "gaming_en");

    // Check if the current scenes are untouched initial scenes of the other language
    const isDefaultSi =
      scenes.length === INITIAL_SINHALA_SCENES.length &&
      scenes[0].title === INITIAL_SINHALA_SCENES[0].title;
    const isDefaultEn =
      scenes.length === INITIAL_ENGLISH_SCENES.length &&
      scenes[0].title === INITIAL_ENGLISH_SCENES[0].title;

    if (newLang === "en" && isDefaultSi) {
      setScenes(INITIAL_ENGLISH_SCENES);
      setActiveSceneId(1);
    } else if (newLang === "si" && isDefaultEn) {
      setScenes(INITIAL_SINHALA_SCENES);
      setActiveSceneId(1);
    }
  };

  // Scene pointers
  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];
  const playingScene = scenes.find((s) => s.id === playingSceneId) || null;

  // Stats
  const generatedCount = scenes.filter((s) => Boolean(s.audioUrl)).length;
  const totalDurationSeconds = scenes.reduce(
    (acc, curr) => acc + (curr.durationSeconds || 0),
    0
  );

  // Generate speech for a single scene
  const generateSceneVoice = async (sceneId: number) => {
    const targetScene = scenes.find((s) => s.id === sceneId);
    if (!targetScene) return;

    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId ? { ...s, isGenerating: true, error: undefined } : s
      )
    );

    try {
      const activeStyleObj = STYLE_OPTIONS.find((st) => st.id === selectedStyle);
      const stylePrompt =
        customStylePrompt.trim() || activeStyleObj?.promptPrefix || "";

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: targetScene.content,
          voice: selectedVoice,
          stylePrompt,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Speech generation failed");
      }

      setScenes((prev) =>
        prev.map((s) =>
          s.id === sceneId
            ? {
                ...s,
                audioUrl: data.audioUrl,
                durationSeconds: data.durationSeconds,
                isGenerating: false,
              }
            : s
        )
      );

      // Auto select and play this scene
      setActiveSceneId(sceneId);
      setPlayingSceneId(sceneId);
      setIsPlaying(true);
    } catch (err: any) {
      console.error("Error generating scene TTS:", err);
      setScenes((prev) =>
        prev.map((s) =>
          s.id === sceneId
            ? {
                ...s,
                isGenerating: false,
                error: err.message || "හඬ සැකසීමේදී දෝෂයක් ඇති විය",
              }
            : s
        )
      );
    }
  };

  // Batch voice all scenes sequentially
  const handleGenerateAll = async () => {
    if (isBatchGenerating) return;
    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: scenes.length });

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      setBatchProgress({ current: i + 1, total: scenes.length });
      setActiveSceneId(scene.id);

      setScenes((prev) =>
        prev.map((s) =>
          s.id === scene.id ? { ...s, isGenerating: true, error: undefined } : s
        )
      );

      try {
        const activeStyleObj = STYLE_OPTIONS.find(
          (st) => st.id === selectedStyle
        );
        const stylePrompt =
          customStylePrompt.trim() || activeStyleObj?.promptPrefix || "";

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: scene.content,
            voice: selectedVoice,
            stylePrompt,
            language,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed");
        }

        setScenes((prev) =>
          prev.map((s) =>
            s.id === scene.id
              ? {
                  ...s,
                  audioUrl: data.audioUrl,
                  durationSeconds: data.durationSeconds,
                  isGenerating: false,
                }
              : s
          )
        );
      } catch (err: any) {
        console.error(`Failed to generate scene ${scene.id}`, err);
        setScenes((prev) =>
          prev.map((s) =>
            s.id === scene.id
              ? {
                  ...s,
                  isGenerating: false,
                  error: err.message || "Error generating audio",
                }
              : s
          )
        );
      }
    }

    setIsBatchGenerating(false);
    setBatchProgress(null);

    // Play from Scene 1
    const firstScene = scenes[0];
    if (firstScene) {
      setPlayingSceneId(firstScene.id);
      setIsPlaying(true);
    }
  };

  // Generate full combined narrative voice
  const handleGenerateFullScript = async () => {
    if (fullScriptAudio.isGenerating) return;
    setFullScriptAudio({ isGenerating: true, error: undefined });

    const combinedText = scenes.map((s) => s.content).join("\n\n");

    try {
      const activeStyleObj = STYLE_OPTIONS.find((st) => st.id === selectedStyle);
      const stylePrompt =
        customStylePrompt.trim() || activeStyleObj?.promptPrefix || "";

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: combinedText,
          voice: selectedVoice,
          stylePrompt,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to voice full script");
      }

      setFullScriptAudio({
        audioUrl: data.audioUrl,
        durationSeconds: data.durationSeconds,
        isGenerating: false,
      });
    } catch (e: any) {
      setFullScriptAudio({
        isGenerating: false,
        error: e.message || "Speech generation error",
      });
    }
  };

  // Download All as ZIP using JSZip
  const handleDownloadZip = async () => {
    const readyScenes = scenes.filter((s) => Boolean(s.audioUrl));
    if (readyScenes.length === 0 || isZipping) return;

    try {
      setIsZipping(true);
      const zip = new JSZip();

      readyScenes.forEach((scene) => {
        if (!scene.audioUrl) return;
        const base64Index = scene.audioUrl.indexOf("base64,");
        if (base64Index !== -1) {
          const base64Data = scene.audioUrl.slice(base64Index + 7);
          const safeTitle = scene.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 25);
          const filename = `${String(scene.id).padStart(2, "0")}_${safeTitle}.wav`;
          zip.file(filename, base64Data, { base64: true });
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Project_IGI_Voiceover_WAV_Clips.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
    } finally {
      setIsZipping(false);
    }
  };

  // Play / Pause toggle
  const togglePlayPause = (sceneId?: number) => {
    const targetId = sceneId !== undefined ? sceneId : playingSceneId || activeSceneId;
    const target = scenes.find((s) => s.id === targetId);

    if (!target?.audioUrl) {
      generateSceneVoice(targetId);
      return;
    }

    if (playingSceneId === targetId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingSceneId(targetId);
      setActiveSceneId(targetId);
      setIsPlaying(true);
    }
  };

  // Next / Prev audio handlers
  const handleNext = () => {
    if (!playingSceneId) return;
    const nextIdx = scenes.findIndex((s) => s.id === playingSceneId) + 1;
    if (nextIdx < scenes.length) {
      const nextScene = scenes[nextIdx];
      setActiveSceneId(nextScene.id);
      if (nextScene.audioUrl) {
        setPlayingSceneId(nextScene.id);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (!playingSceneId) return;
    const prevIdx = scenes.findIndex((s) => s.id === playingSceneId) - 1;
    if (prevIdx >= 0) {
      const prevScene = scenes[prevIdx];
      setActiveSceneId(prevScene.id);
      if (prevScene.audioUrl) {
        setPlayingSceneId(prevScene.id);
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    if (autoPlayNext) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  // Scene manipulation: update, add, delete, duplicate, import
  const handleUpdateContent = (sceneId: number, newContent: string, newTitle?: string) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              content: newContent,
              title: newTitle !== undefined ? newTitle : s.title,
            }
          : s
      )
    );
  };

  const handleAddNewScene = () => {
    const newId = scenes.length > 0 ? Math.max(...scenes.map((s) => s.id)) + 1 : 1;
    const newScene: ScriptScene = {
      id: newId,
      title: `Scene ${newId}`,
      subtitle: language === "si" ? `අලුත් කොටස ${newId}` : `New Part ${newId}`,
      content:
        language === "si"
          ? "මෙහි ඔබේ අලුත් විවරණ පාඨය ඇතුළත් කරන්න..."
          : "Enter your custom voiceover script narration here...",
    };
    setScenes((prev) => [...prev, newScene]);
    setActiveSceneId(newId);
  };

  const handleDeleteScene = (sceneId: number) => {
    if (scenes.length <= 1) return;
    setScenes((prev) => {
      const filtered = prev.filter((s) => s.id !== sceneId);
      // Re-index sequentially
      return filtered.map((s, idx) => ({ ...s, id: idx + 1 }));
    });
    if (activeSceneId === sceneId) {
      setActiveSceneId(1);
    }
    if (playingSceneId === sceneId) {
      setPlayingSceneId(null);
      setIsPlaying(false);
    }
  };

  const handleDuplicateScene = (sceneId: number) => {
    const target = scenes.find((s) => s.id === sceneId);
    if (!target) return;
    const targetIdx = scenes.findIndex((s) => s.id === sceneId);

    const dup: ScriptScene = {
      ...target,
      id: scenes.length + 1,
      title: `${target.title} (Copy)`,
      audioUrl: undefined,
      durationSeconds: undefined,
      isGenerating: false,
      error: undefined,
    };

    const newScenes = [...scenes];
    newScenes.splice(targetIdx + 1, 0, dup);
    const reindexed = newScenes.map((s, idx) => ({ ...s, id: idx + 1 }));
    setScenes(reindexed);
    setActiveSceneId(targetIdx + 2);
  };

  const handleResetScript = () => {
    const defaultScenes =
      language === "si" ? INITIAL_SINHALA_SCENES : INITIAL_ENGLISH_SCENES;
    setScenes(defaultScenes);
    setActiveSceneId(1);
    setPlayingSceneId(null);
    setIsPlaying(false);
  };

  const handleImportScenes = (importedScenes: ScriptScene[], mode: "replace" | "append") => {
    if (mode === "replace") {
      const reindexed = importedScenes.map((s, idx) => ({ ...s, id: idx + 1 }));
      setScenes(reindexed);
      setActiveSceneId(1);
    } else {
      const startId = scenes.length + 1;
      const reindexed = importedScenes.map((s, idx) => ({
        ...s,
        id: startId + idx,
      }));
      setScenes((prev) => [...prev, ...reindexed]);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col pb-28">
      {/* Header */}
      <TacticalHeader
        totalScenes={scenes.length}
        generatedCount={generatedCount}
        totalDurationSeconds={totalDurationSeconds}
        isBatchGenerating={isBatchGenerating}
        isZipping={isZipping}
        language={language}
        onLanguageChange={handleLanguageChange}
        onGenerateAll={handleGenerateAll}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenVercelGuide={() => setIsVercelModalOpen(true)}
        onDownloadZip={handleDownloadZip}
      />

      {/* Batch Generating Banner */}
      {isBatchGenerating && batchProgress && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 py-2.5 px-4 sticky top-[57px] z-20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-amber-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                ස්වයංක්‍රීයව හඬ සැකසෙමින් පවතී: කොටස {batchProgress.current} / {batchProgress.total}...
              </span>
            </div>
            <div className="w-48 bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{
                  width: `${(batchProgress.current / batchProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full flex-1">
        {/* Voice and Delivery Settings */}
        <VoiceSettings
          language={language}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          autoPlayNext={autoPlayNext}
          onAutoPlayToggle={setAutoPlayNext}
          customStylePrompt={customStylePrompt}
          onCustomStyleChange={setCustomStylePrompt}
          onAddNewScene={handleAddNewScene}
          onResetScript={handleResetScript}
        />

        {/* View Toggle Bar & Quick Upload Prompt */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
            <button
              id="tab-cards-view"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "cards"
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>කොටස් වශයෙන් ({scenes.length} Scenes)</span>
            </button>
            <button
              id="tab-full-view"
              onClick={() => setViewMode("full")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "full"
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>සම්පූර්ණ පිටපත (Full Story)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-400 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>ස්ක්‍රිප්ට් එකක් අප්ලෝඩ් කරන්න</span>
            </button>
            <button
              onClick={handleAddNewScene}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Scene</span>
            </button>
          </div>
        </div>

        {/* View Mode: Cards */}
        {viewMode === "cards" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenes.map((scene) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  isActive={activeSceneId === scene.id}
                  isPlaying={playingSceneId === scene.id && isPlaying}
                  canDelete={scenes.length > 1}
                  onSelect={() => setActiveSceneId(scene.id)}
                  onPlay={() => togglePlayPause(scene.id)}
                  onGenerate={() => generateSceneVoice(scene.id)}
                  onUpdateContent={(val, title) =>
                    handleUpdateContent(scene.id, val, title)
                  }
                  onDeleteScene={() => handleDeleteScene(scene.id)}
                  onDuplicateScene={() => handleDuplicateScene(scene.id)}
                />
              ))}
            </div>

            {/* Quick Add scene bottom card */}
            <button
              onClick={handleAddNewScene}
              className="w-full py-4 border-2 border-dashed border-stone-800 hover:border-amber-500/50 hover:bg-stone-900/40 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-300 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ නව කොටසක් එක් කරන්න (Add New Scene Card)</span>
            </button>
          </div>
        )}

        {/* View Mode: Full Combined Script */}
        {viewMode === "full" && (
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                  <span>සම්පූර්ණ හඬකැවීම් පිටපත (Full Story Script)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  මුළු පිටපතම එකවර සංස්කරණය කර සම්පූර්ණ තනි Audio Clip එකක් ලෙස ලබාගත හැක
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-voice-full-script"
                  onClick={handleGenerateFullScript}
                  disabled={fullScriptAudio.isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles
                    className={`w-3.5 h-3.5 ${
                      fullScriptAudio.isGenerating ? "animate-spin" : ""
                    }`}
                  />
                  <span>
                    {fullScriptAudio.isGenerating
                      ? "සම්පූර්ණ හඬ සැකසෙමින් පවතී..."
                      : "සම්පූර්ණ පිටපතම වොයිස් කරන්න (Voice All)"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error display */}
            {fullScriptAudio.error && (
              <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/30 border border-rose-800/40 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{fullScriptAudio.error}</span>
              </div>
            )}

            {/* Audio ready alert */}
            {fullScriptAudio.audioUrl && (
              <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">
                      සම්පූර්ණ ශ්‍රව්‍ය පටය සූදානම් ({fullScriptAudio.durationSeconds}s)
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      Format: 24,000 Hz Mono WAV (Studio Quality)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <audio controls src={fullScriptAudio.audioUrl} className="h-9 rounded-lg" />
                  <a
                    href={fullScriptAudio.audioUrl}
                    download="Full_Voiceover_Recording.wav"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>WAV බාගන්න</span>
                  </a>
                </div>
              </div>
            )}

            <div className="text-xs text-stone-400 font-mono">
              දැනට ඇති කොටස් {scenes.length} ක එකතුව:
            </div>
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 text-xs sm:text-sm text-stone-200 leading-relaxed font-sans max-h-96 overflow-y-auto whitespace-pre-line space-y-4">
              {scenes.map((s) => (
                <div key={s.id} className="border-b border-stone-800/60 pb-3 last:border-b-0">
                  <div className="text-xs font-mono text-amber-400/90 font-bold mb-1">
                    {s.title}
                  </div>
                  <p className="text-stone-300">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Tactical Audio Player */}
      <AudioPlayer
        currentScene={playingScene}
        isPlaying={isPlaying}
        onPlayPause={() => togglePlayPause(playingScene?.id)}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={Boolean(
          playingSceneId &&
            scenes.findIndex((s) => s.id === playingSceneId) < scenes.length - 1
        )}
        hasPrev={Boolean(
          playingSceneId &&
            scenes.findIndex((s) => s.id === playingSceneId) > 0
        )}
        onEnded={handleAudioEnded}
      />

      {/* Modals */}
      <ScriptUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportScenes={handleImportScenes}
      />

      <VercelDeployModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />
    </div>
  );
}
