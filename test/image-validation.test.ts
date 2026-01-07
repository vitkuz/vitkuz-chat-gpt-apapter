import { createAdapter, CHAT_GPT_MODELS } from '../src/index';
import { getRequiredVariable } from './common';

const apiKey = getRequiredVariable('OPENAI_API_KEY');

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
    console.log('Starting Image Validation Test...');

    try {
        console.log('Testing invalid image model fallback...');
        const result = await adapter.createImage({
            prompt: 'Test fallback',
            model: 'invalid-image-model' as any,
        });

        if (result.model !== CHAT_GPT_MODELS.DALL_E_3) {
            throw new Error(`Expected fallback to dall-e-3, but got ${result.model}`);
        }

        if (!lastError || lastError.message !== 'chat-gpt:createImage:unsupported-model') {
            throw new Error('Expected validation error to be logged, but it was not');
        }

        console.log('Fallback and error logging verified successfully!');
        console.log(`Used model: ${result.model}`);
        console.log(`Original input model: ${result.input?.model}`);
    } catch (error) {
        console.error('Image Validation Test Failed:', error);
        process.exit(1);
    }

    console.log('Image Validation Test Completed.');
}

main().catch(console.error);
