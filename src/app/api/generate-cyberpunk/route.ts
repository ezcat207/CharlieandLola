import { respData, respErr } from "@/lib/resp";
import { getUuid } from "@/lib/hash";
import { newStorage } from "@/lib/storage";
import { systemCreditManager, CreditUsageType } from "@/services/system-credits";
import { getUserUuid } from "@/services/user";
import { decreaseCredits, CreditsTransType } from "@/services/credit";
import { geminiApiPool } from "@/lib/gemini-api-pool";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const style = formData.get('style') as string || 'charlie-lola';
    const mode = formData.get('mode') as string || 'image2image'; // Charlie and Lola style transformation
    const customPrompt = formData.get('customPrompt') as string || '';
    const aspectRatio = formData.get('aspectRatio') as string || '4:3';
    const outputFormat = formData.get('outputFormat') as string || 'png';
    const model = formData.get('model') as string || 'standard';
    const imageCount = parseInt(formData.get('imageCount') as string || '0');
    
    // Get multiple images
    const images: File[] = [];
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = formData.get(`image_${i}`) as File | null;
      if (image) {
        images.push(image);
      }
    }

    // Validate parameters
    const validAspectRatios = ['16:9', '21:9', '4:3', '1:1', '3:4', '9:16'];
    const validOutputFormats = ['jpeg', 'png'];
    const validModels = ['standard']; // Only standard model for now
    const validStyles = ['charlie-lola'];

    if (!validAspectRatios.includes(aspectRatio)) {
      return respErr(`Invalid aspect ratio: ${aspectRatio}. Valid options: ${validAspectRatios.join(', ')}`);
    }

    if (!validOutputFormats.includes(outputFormat)) {
      return respErr(`Invalid output format: ${outputFormat}. Valid options: ${validOutputFormats.join(', ')}`);
    }

    if (!validModels.includes(model)) {
      return respErr(`Invalid model: ${model}. Valid options: ${validModels.join(', ')}`);
    }

    if (!validStyles.includes(style)) {
      return respErr(`Invalid style: ${style}. Valid options: ${validStyles.join(', ')}`);
    }

    // Get user info
    const userUuid = await getUserUuid();
    const isRegisteredUser = !!userUuid;
    
    // Check if we have available API keys
    if (!geminiApiPool.hasAvailableKeys()) {
      return respErr("Service is currently at capacity. Please try again later or upgrade to premium for priority access.", 'QUEUE_REQUIRED');
    }
    
    // Get API key from pool
    const geminiApiKey = geminiApiPool.getNextAvailableKey();
    if (!geminiApiKey) {
      return respErr("All API keys are currently busy. Please try again in a few moments.", 'QUEUE_REQUIRED');
    }

    // Validate that at least one image is provided for Charlie and Lola transformation
    if (images.length === 0) {
      return respErr("At least one image is required for Charlie and Lola transformation.");
    }

    // Process the first uploaded image
    const image = images[0];
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Validate image size
    if (buffer.length > 10 * 1024 * 1024) { // 10MB limit
      return respErr("Image is too large. Please use images smaller than 10MB.");
    }

    // Convert image to base64
    const base64Image = buffer.toString("base64");
    const mimeType = image.type;

    // Charlie and Lola style prompt
    const charlieLolaPrompt = customPrompt.trim() || 
      "Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children's cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character.";

    console.log("=== Charlie and Lola API Request Details ===");
    console.log("Mode:", mode);
    console.log("Model:", model);
    console.log("Aspect Ratio:", aspectRatio);
    console.log("Output Format:", outputFormat);
    console.log("Style:", style);
    console.log("Custom Prompt:", customPrompt ? "Yes" : "No");
    console.log("Images uploaded:", images.length);
    console.log("User Registered:", isRegisteredUser);
    console.log("User UUID:", userUuid || "Guest user");
    console.log("===========================================");

    let ai;
    try {
      // Initialize Gemini API
      const { GoogleGenAI } = require("@google/genai");
      ai = new GoogleGenAI({
        apiKey: geminiApiKey,
      });
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
      geminiApiPool.markKeyAsUnavailable(geminiApiKey, 'Failed to initialize');
      return respErr("Failed to initialize AI service. Please try again.");
    }

    // Prepare the image editing prompt
    const imageEditPrompt = [
      { text: charlieLolaPrompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ];

    console.log("🔄 Generating Charlie and Lola style image...");

    let response;
    try {
      // Generate edited image using Gemini 2.5 Flash Image Preview
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: imageEditPrompt,
      });
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Check if it's a quota/limit error
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
        geminiApiPool.markKeyAsUnavailable(geminiApiKey, 'Quota exceeded');
        return respErr("Service is currently busy. Please try again later or upgrade to premium for priority access.", 'QUEUE_REQUIRED');
      }
      
      geminiApiPool.markKeyAsUnavailable(geminiApiKey, error.message || 'Unknown error');
      return respErr("Failed to generate image. Please try again.");
    }

    if (!response.candidates || response.candidates.length === 0) {
      return respErr("No image generated by Gemini API");
    }

    // Find the generated image in the response
    let generatedImageData = null;
    let generatedImageMimeType = 'image/png';

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImageData = part.inlineData.data;
        generatedImageMimeType = part.inlineData.mimeType;
        break;
      }
    }

    if (!generatedImageData) {
      return respErr("No image data found in Gemini API response");
    }

    // Generate filename and store the image
    const batch = getUuid();
    const fileExtension = generatedImageMimeType.split('/')[1];
    const filename = `charlie-lola-${batch}.${fileExtension}`;
    
    let finalImageUrl = `data:${generatedImageMimeType};base64,${generatedImageData}`;
    let storedFilename = filename;

    // Store image if storage is configured
    const hasStorageConfig = process.env.STORAGE_ENDPOINT && 
                            process.env.STORAGE_ACCESS_KEY && 
                            process.env.STORAGE_SECRET_KEY && 
                            process.env.STORAGE_BUCKET;

    if (hasStorageConfig) {
      try {
        const storage = newStorage();
        const key = `output/${filename}`;
        const imageBuffer = Buffer.from(generatedImageData, 'base64');

        console.log(`Storing generated Charlie and Lola image to: ${key}`);

        const uploadResult = await storage.uploadFile({
          body: imageBuffer,
          key,
          contentType: generatedImageMimeType,
          disposition: "inline",
        });

        if (uploadResult.url) {
          finalImageUrl = uploadResult.url;
          storedFilename = uploadResult.filename || filename;
          console.log(`Successfully stored generated image: ${finalImageUrl}`);
        }
      } catch (storageError) {
        console.error("Failed to store generated image:", storageError);
        console.log("Using base64 data URL as fallback");
      }
    }

    // For free generation, no credits consumed unless user wants to download
    const requiredCredits = 1; // Cost for generation
    
    // Free generation for all users - return preview/watermarked image
    // For registered users downloading, consume credits and return full image
    let responseImageUrl = finalImageUrl;
    let requiresRegistration = false;
    
    if (!isRegisteredUser) {
      // Guest user - return preview with registration requirement for download
      requiresRegistration = true;
      responseImageUrl = finalImageUrl; // Still show the generated image
    } else {
      // Registered user - can download without additional costs for now
      // In the future, you might want to implement credit consumption here
      await systemCreditManager.consumeSystemCredits({
        credits: requiredCredits,
        userUuid: userUuid,
        usageType: CreditUsageType.IMAGE_GENERATION,
        description: `Charlie and Lola style transformation using Gemini 2.5 Flash Image Preview`
      });
    }
    
    return respData({
      imageUrl: responseImageUrl,
      filename: storedFilename,
      message: "Charlie and Lola style transformation completed successfully",
      provider: "google.gemini",
      model: "gemini-2.5-flash-image-preview",
      creditsUsed: isRegisteredUser ? requiredCredits : 0,
      aspectRatio,
      outputFormat: fileExtension,
      style: style,
      storedLocally: hasStorageConfig && !finalImageUrl.startsWith('data:'),
      requiresRegistration,
      isPreview: !isRegisteredUser,
      downloadUrl: isRegisteredUser ? responseImageUrl : null,
    });

  } catch (error) {
    console.error("Error in Charlie and Lola generation:", error);
    return respErr("Failed to process Charlie and Lola transformation");
  }
}

export async function GET() {
  return respData({ message: "Cyberpunk Image Generator API" });
}