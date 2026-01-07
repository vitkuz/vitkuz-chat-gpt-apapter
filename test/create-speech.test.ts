import * as dotenv from 'dotenv';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAdapter } from '../src/index';

dotenv.config({ path: join(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is required');
    process.exit(1);
}

const adapter = createAdapter({ apiKey });

async function main() {
    console.log('Starting Speech Generation Test...');

    try {
        const input = 'Hello, this is a test of the new speech generation feature in the ChatGPT adapter.';
        const result = await adapter.createSpeech({
            input,
            model: 'tts-1',
            voice: 'alloy'
        });

        const filePath = join(__dirname, 'responses', 'speech-generation.mp3');
        await writeFile(filePath, result.data);

        console.log(`Saved result to ${filePath}`);
        console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);
    } catch (error) {
        console.error('Speech Generation Test Failed:', error);
    }

    console.log('Speech Generation Test Completed.');
}

main().catch(console.error);
