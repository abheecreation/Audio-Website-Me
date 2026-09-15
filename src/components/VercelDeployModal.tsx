import React, { useState } from "react";
import {
  Globe,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Zap,
  Server,
  Key,
} from "lucide-react";

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-black border border-stone-700 flex items-center justify-center text-white font-bold text-sm">
              ▲
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Vercel Deploy Guide (ඔබේම Personal Web එකක් ලෙස Host කිරීම)</span>
              </h2>
              <p className="text-xs text-stone-400">
                100% Free • Vercel Serverless Ready • Unlimited Personal Access
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-stone-300 leading-relaxed">
          {/* Status badge */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-300 text-xs">
                Vercel Config සූදානම් කර ඇත (Pre-configured & Ready)
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                මෙම Project එක තුළ <code className="text-amber-400 font-mono">vercel.json</code> සහ Vercel Serverless Function එකක් වන <code className="text-amber-400 font-mono">/api/tts.ts</code> ඇතුළත් කර ඇති බැවින් කිසිදු වෙනසක් නොකර සෘජුව Vercel වලට Deploy කළ හැක.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              Vercel වලට Host කරන පියවර (Step-by-Step Instructions):
            </h3>

            {/* Step 1 */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <span>Project එක GitHub එකට Export කරගන්න</span>
              </div>
              <p className="text-xs text-stone-400 pl-7">
                AI Studio ඉහළ දකුණු කෙළවරේ ඇති Settings (⋮) මෙනුවෙන් <strong className="text-stone-200">"Export to GitHub"</strong> හෝ <strong className="text-stone-200">"Download ZIP"</strong> ක්ලික් කර ඔබේ GitHub ගිණුමට Push කරන්න.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>Vercel හි New Project සාදන්න</span>
              </div>
              <p className="text-xs text-stone-400 pl-7">
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 underline inline-flex items-center gap-1"
                >
                  vercel.com <ExternalLink className="w-3 h-3" />
                </a>{" "}
                වෙත ගොස් ඔබගේ GitHub ගිණුමෙන් Sign In වන්න. ඉන්පසු <strong className="text-stone-200">"Add New... -&gt; Project"</strong> තෝරා ඔබේ Repository එක Import කරන්න.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <span>Environment Variable එක එක් කරන්න (Gemini Key)</span>
              </div>
              <p className="text-xs text-stone-400 pl-7">
                Deploy කිරීමට පෙර <strong className="text-stone-200">"Environment Variables"</strong> කොටසේ පහත Variable එක Add කරන්න:
              </p>
              <div className="ml-7 bg-stone-900 border border-stone-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-stone-400">KEY: </span>
                  <span className="text-amber-400 font-bold">GEMINI_API_KEY</span>
                </div>
                <button
                  onClick={() => copyToClipboard("GEMINI_API_KEY", "env-key")}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] cursor-pointer"
                >
                  {copiedKey === "env-key" ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 pl-7">
                (Value එකට ඔබගේ Google AI Studio Gemini API Key එක Paste කරන්න)
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-200">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">
                  4
                </span>
                <span>"Deploy" බොත්තම ක්ලික් කරන්න!</span>
              </div>
              <p className="text-xs text-stone-400 pl-7">
                තත්පර 40 ක් ඇතුළත ඔබේම වෙබ් අඩවිය (උදා: <code className="text-stone-300 font-mono">https://my-voiceover.vercel.app</code>) ක්‍රියාත්මක වේ. එයින් ඔබට ඕනෑම වේලාවක නොමිලේ voiceover සාදාගත හැක!
              </p>
            </div>
          </div>

          {/* Vercel CLI alternative */}
          <div className="border border-stone-800 rounded-xl p-3.5 bg-stone-950/30 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-stone-300">
              <Terminal className="w-4 h-4 text-stone-400" />
              <span>Vercel CLI මඟින් ක්ෂණිකව Deploy කිරීමට (Terminal):</span>
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs text-stone-300">
              <code>npx vercel --prod</code>
              <button
                onClick={() => copyToClipboard("npx vercel --prod", "cli-cmd")}
                className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] cursor-pointer"
              >
                {copiedKey === "cli-cmd" ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition cursor-pointer"
          >
            තේරුම් ගත්තා (Got it)
          </button>
        </div>
      </div>
    </div>
  );
};
