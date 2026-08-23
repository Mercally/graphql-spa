"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
/**
 * All configuration comes from environment variables — no hardcoded URLs/secrets.
 * Loaded via `dotenv` for local dev convenience; in real deployments the platform
 * would inject these directly.
 */
require("dotenv/config");
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function loadConfig() {
    return {
        mongoConnectionString: required('MONGODB_CONNECTION_STRING', 'mongodb://localhost:27017'),
        mongoDatabase: required('MONGODB_DATABASE', 'workmanagement'),
        port: Number(process.env.PORT ?? 4000)
    };
}
//# sourceMappingURL=env.js.map