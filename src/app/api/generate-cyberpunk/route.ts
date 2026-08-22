import { respData, respErr } from "@/lib/resp";
import { getUuid } from "@/lib/hash";
import { newStorage } from "@/lib/storage";
import { systemCreditManager, CreditUsageType } from "@/services/system-credits";
import { getUserUuid } from "@/services/user";
import { CreditsAmount, getUserCredits } from "@/services/credit";

const KIE_API_BASE = "https://api.kie.ai/api/v1/playground";
const KIE_MODEL = "google/nano-banana-edit";
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40; // ~120s timeout

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

    // Check credits for registered users
    if (isRegisteredUser) {
      const userCredits = await getUserCredits(userUuid);
      if (userCredits.left_credits < CreditsAmount.ImageGeneration) {
        return respErr(`Insufficient credits. You need ${CreditsAmount.ImageGeneration} credits but only have ${userCredits.left_credits}. Please recharge to continue.`, 'INSUFFICIENT_CREDITS');
      }
    }

    // Check for Kie.ai API key
    const kieApiKey = process.env.KIEAI_API_KEY;
    if (!kieApiKey) {
      console.error("Kie.ai API key is not configured");
      return respErr("Image generation service is not configured. Please contact support.");
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

    const mimeType = image.type;

    // Kie.ai needs a publicly reachable URL for the input image (no inline base64),
    // so storage is required for this provider.
    const hasStorageConfig = process.env.STORAGE_ENDPOINT &&
                            process.env.STORAGE_ACCESS_KEY &&
                            process.env.STORAGE_SECRET_KEY &&
                            process.env.STORAGE_BUCKET;

    if (!hasStorageConfig) {
      console.error("Storage is not configured; Kie.ai requires a public input image URL");
      return respErr("Image generation service is not configured. Please contact support.");
    }

    const storage = newStorage();
    const batch = getUuid();

    let inputImageUrl: string;
    try {
      const inputExtension = mimeType.split('/')[1] || 'png';
      const inputKey = `input/charlie-lola-${batch}.${inputExtension}`;

      const uploadResult = await storage.uploadFile({
        body: buffer,
        key: inputKey,
        contentType: mimeType,
        disposition: "inline",
      });

      if (!uploadResult.url) {
        throw new Error("Upload did not return a URL");
      }
      inputImageUrl = uploadResult.url;
    } catch (uploadError) {
      console.error("Failed to upload input image:", uploadError);
      return respErr("Failed to process uploaded image. Please try again.");
    }

    // Charlie and Lola style prompt
    const charlieLolaPrompt = customPrompt.trim() || "Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children's cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character. Negative Prompt: No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures!";
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

    console.log("🔄 Generating Charlie and Lola style image via Kie.ai...");

    // Create the Kie.ai generation task
    let taskId: string;
    try {
      const createResponse = await fetch(`${KIE_API_BASE}/createTask`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${kieApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: KIE_MODEL,
          callBackUrl: `${process.env.NEXT_PUBLIC_WEB_URL || 'https://charlielola.com'}/api/callback`,
          input: {
            prompt: charlieLolaPrompt,
            image_urls: [inputImageUrl],
            num_images: "1",
          },
        }),
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok || createResult.code !== 200 || !createResult.data?.taskId) {
        console.error("Kie.ai createTask error:", createResult);
        return respErr("Failed to generate image. Please try again.");
      }

      taskId = createResult.data.taskId;
    } catch (error) {
      console.error("Kie.ai createTask request failed:", error);
      return respErr("Failed to generate image. Please try again.");
    }

    // Poll for task completion
    let resultImageUrl: string | null = null;
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      try {
        const statusResponse = await fetch(`${KIE_API_BASE}/recordInfo?taskId=${taskId}`, {
          headers: { 'Authorization': `Bearer ${kieApiKey}` },
        });
        const statusResult = await statusResponse.json();

        if (statusResult.code !== 200) {
          continue;
        }

        const state = statusResult.data?.state;

        if (state === 'success') {
          try {
            const resultJson = statusResult.data?.resultJson ? JSON.parse(statusResult.data.resultJson) : null;
            resultImageUrl = resultJson?.resultUrls?.[0] || null;
          } catch (parseError) {
            console.error("Failed to parse Kie.ai resultJson:", parseError, statusResult.data?.resultJson);
          }
          break;
        }

        if (state === 'fail') {
          console.error("Kie.ai generation failed:", statusResult.data);
          return respErr(statusResult.data?.failMsg || "Failed to generate image. Please try again.");
        }

        // state === 'waiting' (or similar in-progress state) — keep polling
      } catch (pollError) {
        console.error("Kie.ai polling error:", pollError);
      }
    }

    if (!resultImageUrl) {
      console.error("Kie.ai generation timed out for task:", taskId);
      return respErr("Image generation timed out. Please try again.");
    }

    // Re-store the generated image in our own bucket (Kie.ai's URL is temporary)
    const urlExtensionMatch = resultImageUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    const fileExtension = (urlExtensionMatch?.[1] || outputFormat || 'png').toLowerCase();
    const filename = `charlie-lola-${batch}.${fileExtension}`;

    let finalImageUrl = resultImageUrl;
    let storedFilename = filename;

    try {
      const key = `output/${filename}`;
      console.log(`Storing generated Charlie and Lola image to: ${key}`);

      const storedImage = await storage.downloadAndUpload({
        url: resultImageUrl,
        key,
        contentType: `image/${fileExtension}`,
        disposition: "inline",
      });

      finalImageUrl = storedImage.url;
      storedFilename = storedImage.filename || filename;
      console.log(`Successfully stored generated image: ${finalImageUrl}`);
    } catch (storageError) {
      console.error("Failed to store generated image:", storageError);
      console.log("Using Kie.ai URL as fallback");
    }

    // For free generation, no credits consumed unless user wants to download
    const requiredCredits = CreditsAmount.ImageGeneration; // Cost for generation

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
      await systemCreditManager.consumeSystemCredits({
        credits: requiredCredits,
        userUuid: userUuid,
        usageType: CreditUsageType.IMAGE_GENERATION,
        description: `Charlie and Lola style transformation using Kie.ai nano-banana-edit`,
      });
    }

    return respData({
      imageUrl: responseImageUrl,
      filename: storedFilename,
      message: "Charlie and Lola style transformation completed successfully",
      provider: "kie.ai",
      model: KIE_MODEL,
      creditsUsed: isRegisteredUser ? requiredCredits : 0,
      aspectRatio,
      outputFormat: fileExtension,
      style: style,
      storedLocally: finalImageUrl !== resultImageUrl,
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
