import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAdapter } from '../src/index';
import { getRequiredVariable } from './common';

const apiKey = getRequiredVariable('OPENAI_API_KEY');

const adapter = createAdapter({ apiKey });

async function main() {
    console.log('Starting Image Generation Test...');

    try {
        const result = await adapter.createImage({
            prompt: 'A beautiful sunset over the mountains in Georgia, digital art style.',
            model: 'dall-e-3',
            size: '1024x1024',
            quality: 'standard',
        });

        const filePath = join(__dirname, 'responses', 'image-generation.json');
        await writeFile(filePath, JSON.stringify(result, null, 2));

        console.log(`Saved result to ${filePath}`);
        console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);
        console.log(`Image URL: ${result.data[0].url}`);
    } catch (error) {
        console.error('Image Generation Test Failed:', error);
    }

    console.log('Image Generation Test Completed.');
}

main().catch(console.error);
