import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';
import { createAdapter, CHAT_GPT_MODELS } from '../src/index';
import { getRequiredVariable } from './common';

const apiKey = getRequiredVariable('OPENAI_API_KEY');

const adapter = createAdapter({
    apiKey,
    defaults: {
        model: CHAT_GPT_MODELS.GPT_4o_MINI,
    },
});

const TbilisiPlacesSchema = z.object({
    places: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            category: z.enum(['Sightseeing', 'Food', 'Culture', 'Nature', 'Other']),
        }),
    ),
    summary: z.string(),
});

async function main() {
    console.log('Starting Tbilisi Places Test (Structured Output)...');

    try {
        const result = await adapter.createChatCompletion({
            messages: [
                { role: 'system', content: 'You are a travel guide.' },
                { role: 'user', content: 'What are the best places to visit in Tbilisi?' },
            ],
            schema: TbilisiPlacesSchema,
            schemaName: 'tbilisi_guide',
        });

        const filePath = join(__dirname, 'responses', 'tbilisi-places.json');
        await writeFile(filePath, JSON.stringify(result, null, 2));
        console.log(`Saved result to ${filePath}`);
        console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);

        console.log('Parsed result summary:', result.parsed?.summary);
    } catch (error) {
        console.error('Tbilisi Places Test Failed:', error);
    }

    console.log('Tbilisi Places Test Completed.');
}

main().catch(console.error);
