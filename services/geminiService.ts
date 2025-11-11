import { GoogleGenAI, Modality, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
    const systemInstruction = `You are an expert creative director specializing in visual content. Your task is to enhance the following user prompt to generate a more detailed and visually rich image. Do not generate the image description itself, but rather a better prompt for an AI image generator.

Rules:
- Add specific details about style, mood, and composition.
- Include technical photography or art terms where relevant (e.g., 'shot on 35mm film', 'depth of field', 'chiaroscuro lighting').
- Specify lighting, colors, and atmosphere.
- Make the description more vivid and detailed.
- Keep the core subject of the original prompt.
- The output must be only the enhanced prompt, with no additional text, titles, or explanations.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Original Prompt: "${prompt}"`,
        config: {
            systemInstruction,
            temperature: 0.8,
        },
    });

    return response.text.trim();
};

export const stageRealEstateImage = async (imageFile: File, style: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: `Virtually stage this empty or outdated room in a "${style}" style. Ensure the result is a photorealistic image.` },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        return part.inlineData.data;
    }
    throw new Error("Failed to generate staged image. The response did not contain image data.");
};

export const generateVirtualTryOnImage = async (imageFile: File, style: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `Task: Virtual Try-On. Replace the clothing of the person in this image with a new outfit in a "${style}" style. The new outfit must be photorealistic. IMPORTANT: Do not change the person's face, pose, or the background. The result should be a seamless edit of the original photo.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        return part.inlineData.data;
    }
    throw new Error("Failed to generate virtual try-on image. The response did not contain image data.");
};

export const generateFoodImage = async (prompt: string, style: string): Promise<string> => {
    const fullPrompt = `A photorealistic image of ${prompt}, in a ${style} style. The food should look delicious and appealing.`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '4:3',
        },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
        return base64ImageBytes;
    }
    throw new Error("Failed to generate food image. The response did not contain image data.");
};


export const generateBeautyAdImage = async (imageFile: File, prompt: string, style: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const fullPrompt = `Task: Create a beautiful product advertisement image.
    - Product: [Attached Image]
    - Desired Scene: ${prompt}
    - Style: ${style}
    Instructions: Place the product from the attached image into the described scene. The final image should be photorealistic, high-quality, and suitable for a marketing campaign. The product itself should not be altered, only placed within the new context.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: fullPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        return part.inlineData.data;
    }
    throw new Error("Failed to generate beauty ad image. The response did not contain image data.");
};