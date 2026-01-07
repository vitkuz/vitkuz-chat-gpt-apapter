import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAdapter, CHAT_GPT_MODELS } from '../src/index';
import { getRequiredVariable } from './common';

const apiKey = getRequiredVariable('OPENAI_API_KEY');

const adapter = createAdapter({ apiKey });

async function main() {
    console.log('Starting Speech Generation Test...');

    const models = [CHAT_GPT_MODELS.TTS_1, CHAT_GPT_MODELS.TTS_1_HD];

    for (const model of models) {
        try {
            console.log(`Testing model: ${model}`);
            const input = `Hello, this is a test of the ${model} speech generation in the ChatGPT adapter.`;
            const result = await adapter.createSpeech({
                input,
                model,
                voice: 'alloy',
            });

            const fileName = `${model}-speech-generation.mp3`;
            const filePath = join(__dirname, 'responses', fileName);
            await writeFile(filePath, result.data);

            console.log(`Saved result to ${filePath}`);
            console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);
        } catch (error) {
            console.error(`Speech Generation Test Failed for model ${model}:`, error);
        }
    }

    console.log('Speech Generation Test Completed.');
}

main().catch(console.error);
