import * as dotenv from 'dotenv';
import { join } from 'node:path';

// Load environment variables once
dotenv.config({ path: join(__dirname, '../.env') });

/**
 * Gets a required environment variable or throws an error if it's missing.
 * @param key The environment variable key
 * @returns The value of the environment variable
 */
export function getRequiredVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but missing`);
    }
    return value;
}
