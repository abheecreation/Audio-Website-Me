export type SupportedLanguage = 'si' | 'en';

export interface ScriptScene {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  audioUrl?: string;
  durationSeconds?: number;
  isGenerating?: boolean;
  error?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  vibe: string;
  recommendedFor: ('si' | 'en')[];
}

export interface StyleOption {
  id: string;
  name: string;
  sinhalaName: string;
  description: string;
  sinhalaDescription: string;
  promptPrefix: string;
  language: 'all' | 'si' | 'en';
}

export interface ScriptPreset {
  id: string;
  title: string;
  sinhalaTitle: string;
  language: SupportedLanguage;
  description: string;
  scenes: { title: string; subtitle: string; content: string }[];
}
