import * as dotenv from 'dotenv';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAdapter, CHAT_GPT_MODELS } from '../src/index';

dotenv.config({ path: join(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is required');
    process.exit(1);
}

const adapter = createAdapter({ apiKey });

async function main() {
    console.log('Starting Audio Transcription Test...');

    try {
        const audioFilePath = join(__dirname, 'responses', 'tts-1-speech-generation.mp3');
        const audioBuffer = await readFile(audioFilePath);

        console.log(`Transcribing file: ${audioFilePath}`);

        const result = await adapter.createTranscription({
            file: audioBuffer,
            model: CHAT_GPT_MODELS.WHISPER_1,
            response_format: 'verbose_json',
        });

        const outputFilePath = join(__dirname, 'responses', 'transcription-result.json');
        await writeFile(outputFilePath, JSON.stringify(result, null, 2));

        console.log(`Saved result to ${outputFilePath}`);
        console.log(`Text: ${result.text}`);
        console.log(`Duration: ${result.duration}s`);
        console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);

        if (!result.text.toLowerCase().includes('hello')) {
            throw new Error(`Expected text to contain 'hello', but got: ${result.text}`);
        }

        console.log('Transcription verified successfully!');
    } catch (error) {
        console.error('Audio Transcription Test Failed:', error);
        process.exit(1);
    }

    console.log('Audio Transcription Test Completed.');
}

main().catch(console.error);
