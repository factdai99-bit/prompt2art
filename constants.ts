
import { StylePack } from './types';

export const STYLE_PACKS: StylePack[] = [
  {
    id: 'anime',
    name: 'Anime Pack',
    description: 'Vibrant and expressive Japanese anime style.',
    promptPrefix: 'masterpiece, best quality, anime style, vibrant colors, expressive characters, detailed background, ',
    thumbnail: 'https://picsum.photos/seed/anime/300/200',
  },
  {
    id: 'realistic',
    name: 'Realistic Human Pack',
    description: 'Photorealistic portraits and scenes.',
    promptPrefix: 'photorealistic, hyperrealistic, 8k, ultra realistic, dramatic lighting, sharp focus, detailed skin texture, ',
    thumbnail: 'https://picsum.photos/seed/realistic/300/200',
  },
  {
    id: 'fantasy',
    name: 'Fantasy Pack',
    description: 'Epic and magical fantasy worlds.',
    promptPrefix: 'fantasy art, epic, magical, ethereal, concept art, matte painting, trending on artstation, intricate details, ',
    thumbnail: 'https://picsum.photos/seed/fantasy/300/200',
  },
  {
    id: 'cartoon',
    name: 'Cartoon Pack',
    description: 'Fun and friendly modern cartoon style.',
    promptPrefix: 'modern cartoon style, 3d render, pixar style, friendly characters, smooth shading, vibrant and cheerful, ',
    thumbnail: 'https://picsum.photos/seed/cartoon/300/200',
  },
    {
    id: 'horror',
    name: 'Horror Pack',
    description: 'Dark, eerie, and atmospheric horror scenes.',
    promptPrefix: 'horror, dark, eerie, atmospheric, creepy, unsettling, cinematic lighting, style of stephen king, lovecraftian, ',
    thumbnail: 'https://picsum.photos/seed/horror/300/200',
  },
  {
    id: 'logo',
    name: 'Logo Generator Pack',
    description: 'Clean, modern, and minimalist logo designs.',
    promptPrefix: 'minimalist logo design, vector art, clean lines, modern, flat design, for a brand about ',
    thumbnail: 'https://picsum.photos/seed/logo/300/200',
  },
  {
    id: 'premium',
    name: 'Premium Ultra HD',
    description: 'Highest quality, cinematic, and detailed.',
    promptPrefix: 'ultra hd, cinematic 8k wallpaper, masterpiece, stunning visual, intricate detail, professional photography, bokeh, ',
    thumbnail: 'https://picsum.photos/seed/premium/300/200',
  },
];
