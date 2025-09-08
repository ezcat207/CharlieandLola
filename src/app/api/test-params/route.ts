import { respData, respErr } from "@/lib/resp";

export async function POST(request: Request) {
  try {
    console.log("=== Test Params API Called ===");
    
    const formData = await request.formData();
    console.log("FormData received successfully");
    
    // Extract all parameters
    const image = formData.get('image') as File | null;
    const style = formData.get('style') as string || 'cyberpunk';
    const mode = formData.get('mode') as string || 'text2image';
    const customPrompt = formData.get('customPrompt') as string || '';
    const aspectRatio = formData.get('aspectRatio') as string || '16:9';
    const outputFormat = formData.get('outputFormat') as string || 'jpeg';
    const model = formData.get('model') as string || 'pro';

    console.log("Extracted parameters:", {
      image: image ? `File: ${image.name}, ${image.size} bytes` : "No image",
      style,
      mode,
      customPrompt,
      aspectRatio,
      outputFormat,
      model
    });

    // Validate parameters
    const validAspectRatios = ['16:9', '21:9', '4:3', '1:1', '3:4', '9:16'];
    const validOutputFormats = ['jpeg', 'png'];
    const validModels = ['pro', 'max'];
    const validStyles = ['classic', 'neon-noir', 'tech-ninja'];

    const validationErrors = [];

    if (!validAspectRatios.includes(aspectRatio)) {
      validationErrors.push(`Invalid aspect ratio: ${aspectRatio}. Valid options: ${validAspectRatios.join(', ')}`);
    }

    if (!validOutputFormats.includes(outputFormat)) {
      validationErrors.push(`Invalid output format: ${outputFormat}. Valid options: ${validOutputFormats.join(', ')}`);
    }

    if (!validModels.includes(model)) {
      validationErrors.push(`Invalid model: ${model}. Valid options: ${validModels.join(', ')}`);
    }

    if (!validStyles.includes(style)) {
      validationErrors.push(`Invalid style: ${style}. Valid options: ${validStyles.join(', ')}`);
    }

    console.log("Validation errors:", validationErrors);

    if (validationErrors.length > 0) {
      return respErr(validationErrors.join('; '));
    }

    // Determine required credits based on model
    const requiredCredits = model === 'max' ? 20 : 10;

    // Build the request body that would be sent to Kie.ai
    const requestBody: {
      prompt: string;
      model: string;
      aspectRatio: string;
      promptUpsampling: boolean;
      outputFormat: string;
      inputImage?: string;
    } = {
      prompt: customPrompt || `Cyberpunk style: ${style}`,
      model: "flux-kontext-pro",
      aspectRatio: aspectRatio,
      promptUpsampling: model === 'max',
      outputFormat: outputFormat
    };

    // Add image if provided
    if (image && mode === 'image2image') {
      requestBody.inputImage = `[Image data would be uploaded here]`;
    }

    const responseData = {
      message: "Parameters validated successfully",
      receivedParams: {
        mode,
        style,
        aspectRatio,
        outputFormat,
        model,
        customPrompt: customPrompt || "Using default prompt",
        hasImage: !!image,
        imageSize: image ? `${(image.size / 1024).toFixed(2)} KB` : "No image"
      },
      calculatedValues: {
        requiredCredits,
        finalPrompt: requestBody.prompt,
        promptUpsampling: requestBody.promptUpsampling
      },
      kieApiRequestBody: requestBody,
      validation: {
        aspectRatio: validAspectRatios.includes(aspectRatio),
        outputFormat: validOutputFormats.includes(outputFormat),
        model: validModels.includes(model),
        style: validStyles.includes(style)
      }
    };

    console.log("Returning response:", responseData);
    return respData(responseData);

  } catch (error) {
    console.error("Test params error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return respErr(`Failed to process test parameters: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function GET() {
  return respData({
    message: "Parameter test endpoint",
    usage: "Send POST request with FormData containing: mode, style, aspectRatio, outputFormat, model, customPrompt, image"
  });
}
