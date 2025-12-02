"use server";

import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;

if (!API_KEY) {
    console.warn("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return {
    inlineData: { data: base64, mimeType: file.type },
  };
};

// Helper for Hugging Face Inference
async function queryHuggingFace(model: string, inputs: any) {
    if (!HF_TOKEN) {
        throw new Error("HF_TOKEN is not set. Please add it to your .env.local file.");
    }
    
    const response = await fetch(`https://router.huggingface.co/models/${model}`, {
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(inputs),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API Error: ${error}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
}

export const enhancePromptAction = async (prompt: string): Promise<string> => {
    const systemInstruction = `You are an expert creative director specializing in visual content. Your task is to enhance the following user prompt to generate a more detailed and visually rich image. Do not generate the image description itself, but rather a better prompt for an AI image generator.

Rules:
- Add specific details about style, mood, and composition.
- Include technical photography or art terms where relevant (e.g., 'shot on 35mm film', 'depth of field', 'chiaroscuro lighting').
- Specify lighting, colors, and atmosphere.
- Make the description more vivid and detailed.
- Keep the core subject of the original prompt.
- The output must be only the enhanced prompt, with no additional text, titles, or explanations.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: `Original Prompt: "${prompt}"`,
        config: {
            systemInstruction,
            temperature: 0.8,
        },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "";
};

export const stageRealEstateImageAction = async (formData: FormData): Promise<string> => {
    const imageFile = formData.get('image') as File;
    const style = formData.get('style') as string;

    if (!imageFile || !style) throw new Error("Missing image or style");

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    const prompt = `Virtually stage this empty or outdated room in a "${style}" style. Photorealistic.`;
    
    // Using timbrooks/instruct-pix2pix for free, open instruction-based editing.
    return await queryHuggingFace("timbrooks/instruct-pix2pix", {
        inputs: base64Image,
        parameters: {
            prompt: prompt,
            image_guidance_scale: 1.5,
        }
    });
};

export const generateVirtualTryOnImageAction = async (formData: FormData): Promise<string> => {
    const imageFile = formData.get('image') as File;
    const style = formData.get('style') as string;

    if (!imageFile || !style) throw new Error("Missing image or style");

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const prompt = `Replace the clothing with a ${style} outfit. Do not change face.`;
    
    return await queryHuggingFace("timbrooks/instruct-pix2pix", {
        inputs: base64Image,
        parameters: {
            prompt: prompt,
            image_guidance_scale: 1.5,
        }
    });
};

export const generateFoodImageAction = async (prompt: string, style: string): Promise<string> => {
    const fullPrompt = `A photorealistic image of ${prompt}, in a ${style} style. The food should look delicious and appealing.`;

    // Using FLUX.1-schnell for fast, free text-to-image generation
    return await queryHuggingFace("black-forest-labs/FLUX.1-schnell", {
        inputs: fullPrompt,
    });
};


export const generateBeautyAdImageAction = async (formData: FormData): Promise<string> => {
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const style = formData.get('style') as string;

    if (!imageFile || !prompt || !style) throw new Error("Missing image, prompt or style");

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const fullPrompt = `Place this product in a ${style} scene: ${prompt}`;
    
    return await queryHuggingFace("timbrooks/instruct-pix2pix", {
        inputs: base64Image,
        parameters: {
            prompt: fullPrompt,
            image_guidance_scale: 1.2,
        }
    });
};

export const generateBeautyAdImageExperimentalAction = async (formData: FormData): Promise<{ image: string; headline: string; tagline: string }> => {
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const style = formData.get('style') as string;

    if (!imageFile || !prompt || !style) throw new Error("Missing image, prompt or style");

    // 1. Analyze image and generate prompt + copy using Gemini
    const imagePart = await fileToGenerativePart(imageFile);
    
    const analysisPrompt = `
    Analyze this product image and the user's request.
    User Request: Place this product in a "${style}" scene. Context: ${prompt}.

    Tasks:
    1. Describe the product visually in extreme detail (shape, color, material, text on label, type of container).
    2. Create a high-quality text-to-image prompt to generate a photorealistic image of a product that LOOKS EXACTLY like this one, placed in the requested scene. The prompt must be very descriptive of the product itself so the AI can recreate it.
    3. Write a catchy, production-level ad headline (max 10 words).
    4. Write a short, persuasive tagline (max 15 words).

    Return ONLY a JSON object with this structure:
    {
        "imagePrompt": "string",
        "headline": "string",
        "tagline": "string"
    }
    `;

    const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
            { role: 'user', parts: [imagePart, { text: analysisPrompt }] }
        ]
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    let parsedData;
    
    try {
        parsedData = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse Gemini response:", responseText);
        // Fallback
        parsedData = {
            imagePrompt: `A photorealistic ${style} ad shot of a beauty product. ${prompt}`,
            headline: "Experience Beauty",
            tagline: "Radiance redefined."
        };
    }

    // 2. Generate Image using FLUX.1-schnell (Free, High Quality)
    const generatedImageBase64 = await queryHuggingFace("black-forest-labs/FLUX.1-schnell", {
        inputs: parsedData.imagePrompt,
    });

    return {
        image: generatedImageBase64,
        headline: parsedData.headline,
        tagline: parsedData.tagline
    };
};