// Test script to verify parameter passing
const FormData = require('form-data');

async function testParams() {
  console.log('Testing parameter passing...\n');

  // Test cases
  const testCases = [
    {
      name: 'Basic Pro Model',
      params: {
        mode: 'image2image',
        style: 'classic',
        aspectRatio: '16:9',
        outputFormat: 'jpeg',
        model: 'pro',
        customPrompt: 'Test cyberpunk transformation'
      }
    },
    {
      name: 'Max Model with PNG',
      params: {
        mode: 'image2image',
        style: 'neon-noir',
        aspectRatio: '1:1',
        outputFormat: 'png',
        model: 'max',
        customPrompt: 'High quality neon noir style'
      }
    },
    {
      name: 'Tech Ninja Style',
      params: {
        mode: 'image2image',
        style: 'tech-ninja',
        aspectRatio: '9:16',
        outputFormat: 'jpeg',
        model: 'pro',
        customPrompt: ''
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n=== Testing: ${testCase.name} ===`);
    
    // Create FormData
    const formData = new FormData();
    Object.entries(testCase.params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add a dummy image
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    formData.append('image', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });

    try {
      console.log('Sending request to:', 'http://localhost:3002/api/test-params');
      console.log('Parameters:', testCase.params);
      
      const response = await fetch('http://localhost:3002/api/test-params', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type manually, let FormData set it with boundary
          ...formData.getHeaders()
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        continue;
      }
      
      if (result.code === 0) {
        console.log('✅ Success!');
        console.log('Received Params:', result.data.receivedParams);
        console.log('Calculated Values:', result.data.calculatedValues);
        console.log('Kie.ai Request Body:', result.data.kieApiRequestBody);
        console.log('Validation:', result.data.validation);
      } else {
        console.log('❌ Error:', result.msg || result.message || 'Unknown error');
      }

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      console.error('Error details:', error);
    }
  }
}

// Run the test
testParams();
