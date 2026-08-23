/**
 * All configuration comes from environment variables — no hardcoded URLs/secrets.
 * Loaded via `dotenv` for local dev convenience; in real deployments the platform
 * would inject these directly.
 */
import 'dotenv/config';

export interface AppConfig {
  mongoConnectionString: string;
  mongoDatabase: string;
  port: number;
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return {
    mongoConnectionString: required('MONGODB_CONNECTION_STRING', 'mongodb://localhost:27017'),
    mongoDatabase: required('MONGODB_DATABASE', 'workmanagement'),
    port: Number(process.env.PORT ?? 4000)
  };
}
