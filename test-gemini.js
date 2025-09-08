const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const https = require('https');
const path = require('path');

// Configuration
const API_KEY = 'AIzaSyBZb8koXKLk3h5FNWgidSB7EvjsF8dJjdM';
const MODEL_NAME = 'gemini-2.5-flash-image-preview';
const IMAGE_URL = 'https://pub-caf0ef6125ee4999a8a4bc4c0ec36bca.r2.dev/input/input_9c7c224d-a0f1-4ed9-9776-c35367e87ba2_0.jpeg';

const PROMPT = "Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children's cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character. Negative Prompt: No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures!";
// Download image function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('🚀 Starting Gemini 2.5 Flash Image Preview test...');
    
    // Initialize the GoogleGenAI client
    const ai = new GoogleGenAI({
      apiKey: API_KEY,
    });

    // Download input image
    console.log('📥 Downloading input image...');
    const inputImagePath = path.join(__dirname, 'input_image.jpg');
    await downloadImage(IMAGE_URL, inputImagePath);
    console.log('✅ Input image downloaded successfully');

    // Read and convert image to base64
    const imageData = fs.readFileSync(inputImagePath);
    const base64Image = imageData.toString("base64");

    // Prepare the image editing prompt
    const imageEditPrompt = [
      { text: PROMPT },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ];

    console.log('🔄 Generating Charlie and Lola style image...');
    console.log('📝 Prompt:', PROMPT.substring(0, 100) + '...');

    // Generate edited image
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: imageEditPrompt,
    });

    console.log('\n✅ API Response received:');
    console.log('📋 Response structure:', {
      candidates: response.candidates?.length,
      parts: response.candidates?.[0]?.content?.parts?.length
    });

    // Process the response and save generated images
    let imageCount = 0;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageCount++;
        const outputPath = path.join(__dirname, `generated_charlie_lola_${imageCount}.png`);
        
        // Save the generated image
        fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, "base64"));
        
        console.log(`\n🖼️ Generated image ${imageCount}:`);
        console.log(`   ✅ Saved to: ${outputPath}`);
        console.log(`   📏 Size: ${Buffer.from(part.inlineData.data, "base64").length} bytes`);
        console.log(`   🎨 MIME Type: ${part.inlineData.mimeType}`);
      } else if (part.text) {
        console.log(`\n📝 Text response: ${part.text}`);
      }
    }

    if (imageCount === 0) {
      console.log('⚠️ No images were generated');
      console.log('📄 Full response:', JSON.stringify(response, null, 2));
    } else {
      console.log(`\n🎉 Successfully generated ${imageCount} Charlie and Lola style image(s)!`);
    }

    // Clean up input image
    fs.unlinkSync(inputImagePath);
    console.log('\n🧹 Input image cleaned up');
    console.log('📁 Check the current directory for generated images');

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    console.error('🔍 Full error:', error);
    
    // Clean up on error
    const inputImagePath = path.join(__dirname, 'input_image.jpg');
    if (fs.existsSync(inputImagePath)) {
      fs.unlinkSync(inputImagePath);
    }
    
    process.exit(1);
  }
}

// Run the test
main().catch(console.error);