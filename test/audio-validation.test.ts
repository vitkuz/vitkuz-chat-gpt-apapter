import * as dotenv from 'dotenv';
import { join } from 'node:path';
import { createAdapter, CHAT_GPT_MODELS } from '../src/index';

dotenv.config({ path: join(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is required');
    process.exit(1);
}

// Custom logger to capture errors
let lastError: { message: string; data: any } | null = null;
const logger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: (message: string, data: any) => {
        console.log(`Captured expected error: ${message}`, data);
        lastError = { message, data };
    },
};

const adapter = createAdapter({ apiKey }, logger);

async function main() {
    console.log('Starting Audio Validation Test...');

    try {
        console.log('Testing invalid model fallback...');
        const result = await adapter.createSpeech({
            input: 'Test fallback',
            model: 'invalid-model' as any,
            voice: 'alloy',
        });

        if (result.model !== CHAT_GPT_MODELS.TTS_1) {
            throw new Error(`Expected fallback to tts-1, but got ${result.model}`);
        }

        if (!lastError || lastError.message !== 'chat-gpt:createSpeech:unsupported-model') {
            throw new Error('Expected validation error to be logged, but it was not');
        }

        console.log('Fallback and error logging verified successfully!');
        console.log(`Used model: ${result.model}`);
        console.log(`Original input model: ${result.input?.model}`);
    } catch (error) {
        console.error('Audio Validation Test Failed:', error);
        process.exit(1);
    }

    console.log('Audio Validation Test Completed.');
}

main().catch(console.error);
