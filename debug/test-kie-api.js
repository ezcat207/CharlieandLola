// Test script to verify Kie.ai API parameter passing
const fs = require('fs');
const FormData = require('form-data');

async function testKieApi() {
  console.log('Testing Kie.ai API parameter passing...\n');

  // Test data
  const testData = {
    mode: 'image2image',
    style: 'classic',
    aspectRatio: '16:9',
    outputFormat: 'jpeg',
    model: 'max',
    customPrompt: 'Test cyberpunk transformation'
  };

  console.log('Test Parameters:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');

  // Create a simple test image (1x1 pixel PNG)
  const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

  // Create FormData
  const formData = new FormData();
  formData.append('mode', testData.mode);
  formData.append('style', testData.style);
  formData.append('aspectRatio', testData.aspectRatio);
  formData.append('outputFormat', testData.outputFormat);
  formData.append('model', testData.model);
  formData.append('customPrompt', testData.customPrompt);
  formData.append('image', testImageBuffer, {
    filename: 'test.png',
    contentType: 'image/png'
  });

  try {
    const response = await fetch('http://localhost:3002/api/generate-cyberpunk', {
      method: 'POST',
      body: formData
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (response.ok) {
      const responseJson = JSON.parse(responseText);
      console.log('\nParsed Response:', JSON.stringify(responseJson, null, 2));
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testKieApi();
