export interface ApiKeyStatus {
  key: string;
  isAvailable: boolean;
  lastError?: string;
  lastUsed?: Date;
  requestCount: number;
  dailyLimit: number;
}

export class GeminiApiPool {
  private apiKeys: ApiKeyStatus[] = [];
  private currentIndex = 0;

  constructor() {
    this.initializeApiKeys();
  }

  private initializeApiKeys() {
    // Get all Gemini API keys from environment variables
    const geminiKeys = [
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_API_KEY_2, 
      process.env.GOOGLE_API_KEY_3,
      process.env.GOOGLE_API_KEY_4,
      process.env.GOOGLE_API_KEY_5,
    ].filter(key => key && key.trim() !== '');

    this.apiKeys = geminiKeys.map(key => ({
      key: key!,
      isAvailable: true,
      requestCount: 0,
      dailyLimit: 1000, // Adjust based on your API limits
    }));

    if (this.apiKeys.length === 0) {
      throw new Error('No Gemini API keys found in environment variables');
    }

    console.log(`Initialized Gemini API pool with ${this.apiKeys.length} keys`);
  }

  public getNextAvailableKey(): string | null {
    if (this.apiKeys.length === 0) {
      return null;
    }

    // Try each key starting from current index
    for (let i = 0; i < this.apiKeys.length; i++) {
      const index = (this.currentIndex + i) % this.apiKeys.length;
      const keyStatus = this.apiKeys[index];

      if (keyStatus.isAvailable && keyStatus.requestCount < keyStatus.dailyLimit) {
        this.currentIndex = (index + 1) % this.apiKeys.length;
        keyStatus.lastUsed = new Date();
        keyStatus.requestCount++;
        return keyStatus.key;
      }
    }

    return null; // No available keys
  }

  public markKeyAsUnavailable(key: string, error?: string) {
    const keyStatus = this.apiKeys.find(k => k.key === key);
    if (keyStatus) {
      keyStatus.isAvailable = false;
      keyStatus.lastError = error;
      console.log(`Marked API key as unavailable: ${key.substring(0, 10)}... Error: ${error}`);
    }
  }

  public markKeyAsAvailable(key: string) {
    const keyStatus = this.apiKeys.find(k => k.key === key);
    if (keyStatus) {
      keyStatus.isAvailable = true;
      keyStatus.lastError = undefined;
      console.log(`Marked API key as available: ${key.substring(0, 10)}...`);
    }
  }

  public getPoolStatus() {
    return {
      totalKeys: this.apiKeys.length,
      availableKeys: this.apiKeys.filter(k => k.isAvailable).length,
      keys: this.apiKeys.map(k => ({
        keyPrefix: k.key.substring(0, 10) + '...',
        isAvailable: k.isAvailable,
        requestCount: k.requestCount,
        dailyLimit: k.dailyLimit,
        lastError: k.lastError,
        lastUsed: k.lastUsed,
      }))
    };
  }

  public resetDailyLimits() {
    this.apiKeys.forEach(key => {
      key.requestCount = 0;
      key.isAvailable = true;
      key.lastError = undefined;
    });
    console.log('Reset daily limits for all API keys');
  }

  public hasAvailableKeys(): boolean {
    return this.apiKeys.some(k => k.isAvailable && k.requestCount < k.dailyLimit);
  }
}

// Singleton instance
export const geminiApiPool = new GeminiApiPool();