export interface StylePack {
  id: string;
  name: string;
  description: string;
  promptPrefix: string;
  thumbnail: string;
}

export interface GenerationResult {
  id: string;
  originalPrompt: string;
  boostedPrompt: string;
  imageUrl: string;
  stylePack: StylePack;
  timestamp: string;
  isEnhanced?: boolean;
  aspectRatio: '1:1' | '9:16' | '16:9';
}