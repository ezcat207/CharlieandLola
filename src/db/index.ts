import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Database instance for Node.js environment
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function db() {
  // For Node.js environment, use process.env directly
  const env = process.env;

  // Detect if running in Cloudflare Workers environment
  const isCloudflareWorker =
    typeof globalThis !== "undefined" && "Cloudflare" in globalThis;

  // Detect if set Hyperdrive
  const isHyperdrive = "HYPERDRIVE" in env;

  console.log("is cloudflare worker:", isCloudflareWorker);
  console.log("is hyperdrive:", isHyperdrive);

  let databaseUrl = env.DATABASE_URL;
  if (isCloudflareWorker && isHyperdrive) {
    // HYPERDRIVE is a connection string, not an object
    databaseUrl = env.HYPERDRIVE || env.DATABASE_URL;
    console.log("using Hyperdrive connection");
  }

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  // Debug log to see what URL we're working with
  console.log('Database URL before encoding check:', databaseUrl);
  
  // Apply URL encoding for the specific password issue we're seeing
  if (databaseUrl.includes(':P/9rsjkUHq68KJ8@')) {
    databaseUrl = databaseUrl.replace(':P/9rsjkUHq68KJ8@', ':P%2F9rsjkUHq68KJ8@');
    console.log('Applied URL encoding for database password special character');
  }
  
  console.log('Database URL after encoding check:', databaseUrl);
  
  // Validate URL is now properly formatted
  try {
    new URL(databaseUrl);
    console.log('Database URL validation successful');
  } catch (error) {
    console.error('Database URL validation failed:', error);
    throw new Error(`Invalid DATABASE_URL format: ${error.message}`);
  }

  // In Cloudflare Workers, create new connection each time
  if (isCloudflareWorker) {
    console.log("in Cloudflare Workers environment");
    // Workers environment uses minimal configuration
    const client = postgres(databaseUrl, {
      prepare: false,
      max: 1, // Limit to 1 connection in Workers
      idle_timeout: 10, // Shorter timeout for Workers
      connect_timeout: 5,
    });

    return drizzle(client);
  }

  // In Node.js environment, use singleton pattern
  if (dbInstance) {
    return dbInstance;
  }

  // Node.js environment with connection pool configuration
  const client = postgres(databaseUrl, {
    prepare: false,
    max: 10, // Maximum connections in pool
    idle_timeout: 30, // Idle connection timeout (seconds)
    connect_timeout: 10, // Connection timeout (seconds)
  });
  dbInstance = drizzle({ client });

  return dbInstance;
}
