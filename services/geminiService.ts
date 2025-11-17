
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const base64ToInlineData = (base64String: string) => {
    const [header, data] = base64String.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1];

    if (!mimeType || !data) {
        throw new Error("Invalid base64 string format");
    }

    return { mimeType, data };
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

/**
 * Boosts a user's prompt using a text-generation model.
 * @param prompt The user's original prompt.
 * @param stylePrefix The prefix for the selected style pack.
 * @returns The boosted, more detailed prompt.
 */
export const boostPrompt = async (prompt: string, stylePrefix: string): Promise<string> => {
  try {
    const systemInstruction = `You are a professional prompt engineer for an AI image generator. 
      Your task is to take a user's simple prompt and a style prefix, and expand it into a detailed, professional, and creative prompt.
      Incorporate elements like quality (e.g., "masterpiece", "8k"), lighting (e.g., "cinematic lighting", "soft shadows"), camera angles (e.g., "low angle shot", "wide angle"), and specific details relevant to the style.
      Combine the style prefix with the user's idea seamlessly.
      ONLY output the final, boosted prompt text. Do not add any conversational text, explanations, or quotation marks around the prompt.`;
    
    const fullPrompt = `${stylePrefix} ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error boosting prompt:", error);
    // Fallback to a simpler combined prompt if boosting fails
    return `${stylePrefix} ${prompt}, high quality, detailed`;
  }
};

/**
 * Generates an image from a prompt using the Imagen model.
 * @param prompt The detailed prompt to generate an image from.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A base64 encoded image string.
 */
export const generateImage = async (prompt: string, aspectRatio: '1:1' | '9:16' | '16:9'): Promise<string> => {
  try {
    // Using Imagen 4 for high-quality generation with aspect ratio control
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;

    if (!base64ImageBytes) {
      throw new Error("No image data found in response from Imagen model.");
    }
    
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};

/**
 * Upscales an image using Gemini's image-to-image capabilities.
 * @param base64Image The base64 encoded image to upscale.
 * @returns A new, upscaled base64 encoded image string.
 */
export const upscaleImage = async (base64Image: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: base64ToInlineData(base64Image),
        };

        const textPart = {
            text: "Perform an AI super-resolution upscale on this image to a crisp 4K resolution. The final image must be extremely sharp, clean, and photorealistic. Eliminate any blur, pixelation, or compression artifacts from the original. Enhance fine details, textures, and lighting to a professional, hyper-realistic standard. Ensure the output has no digital noise or imperfections."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No upscaled image data found in response");

    } catch (error) {
        console.error("Error upscaling image:", error);
        throw new Error("Failed to enhance image resolution.");
    }
};


/**
 * Extends an image in a given direction using AI outpainting.
 * @param base64Image The base64 encoded image to extend.
 * @param extensionPrompt A prompt describing what to add in the extension.
 * @param direction The direction to extend the image ('top', 'bottom', 'left', 'right').
 * @returns A new, extended base64 encoded image string.
 */
export const extendImage = async (
    base64Image: string,
    extensionPrompt: string,
    direction: 'top' | 'bottom' | 'left' | 'right'
): Promise<string> => {
    try {
        const originalImage = await loadImage(base64Image);
        const { width, height } = originalImage;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        let newWidth = width;
        let newHeight = height;
        let drawX = 0;
        let drawY = 0;
        let positionDescription = '';

        switch (direction) {
            case 'top':
                newHeight = height * 2;
                drawY = height;
                positionDescription = 'at the bottom half';
                break;
            case 'bottom':
                newHeight = height * 2;
                positionDescription = 'at the top half';
                break;
            case 'left':
                newWidth = width * 2;
                drawX = width;
                positionDescription = 'in the right half';
                break;
            case 'right':
                newWidth = width * 2;
                positionDescription = 'in the left half';
                break;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(originalImage, drawX, drawY, width, height);

        const compositeImageBase64 = canvas.toDataURL('image/png');
        const imagePart = {
            inlineData: base64ToInlineData(compositeImageBase64),
        };

        const textPrompt = `The provided image has a large transparent area. The original image content is located ${positionDescription}. 
        Your task is to creatively and seamlessly fill the transparent area, extending the original image. 
        The extension should match the style, lighting, and context of the original content.
        ${extensionPrompt ? `Specifically, incorporate this into the extension: "${extensionPrompt}".` : 'Extend the scene naturally.'}
        The final output should be a single, complete image with no transparent areas.`;
        
        const textPart = { text: textPrompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No extended image data found in response");

    } catch (error) {
        console.error("Error extending image:", error);
        throw new Error("Failed to extend image.");
    }
};
