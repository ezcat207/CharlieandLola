import { respData, respErr } from "@/lib/resp";

export async function POST(request: Request) {
  try {
    console.log("🎯 Callback received from nano-banana-edit!");
    
    // Log headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log("📋 Headers:", JSON.stringify(headers, null, 2));
    
    // Get the callback data
    const body = await request.text();
    console.log("📦 Raw body:", body);
    
    // Try to parse as JSON
    let callbackData;
    try {
      callbackData = JSON.parse(body);
      console.log("✅ Parsed callback data:", JSON.stringify(callbackData, null, 2));
    } catch (e) {
      console.log("⚠️ Body is not JSON, treating as text");
      callbackData = { rawBody: body };
    }
    
    // Store the result somewhere for testing (in a real app, you'd store in DB)
    console.log("🎉 nano-banana-edit task completed!");
    console.log("Result:", callbackData);
    
    return respData({ 
      message: "Callback received successfully",
      timestamp: new Date().toISOString(),
      data: callbackData 
    });
    
  } catch (error) {
    console.error("❌ Callback error:", error);
    return respErr("Failed to process callback");
  }
}

export async function GET() {
  return respData({ 
    message: "Callback endpoint is ready",
    timestamp: new Date().toISOString() 
  });
}