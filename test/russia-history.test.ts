import * as dotenv from 'dotenv';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAdapter, CHAT_GPT_MODELS } from '../src/index';

dotenv.config({ path: join(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is required');
    process.exit(1);
}

const adapter = createAdapter({ apiKey });

const models = [
    CHAT_GPT_MODELS.GPT_4o_MINI,
    CHAT_GPT_MODELS.GPT_4o,
    CHAT_GPT_MODELS.GPT_3_5_TURBO,
];

async function main() {
    console.log('Starting Russia History Test...');

    for (const model of models) {
        try {
            console.log(`Testing model: ${model}`);
            const result = await adapter.createChatCompletion({
                model,
                messages: [
                    { role: 'system', content: 'You are a historian.' },
                    { role: 'user', content: 'Provide a brief history of Russia.' },
                ],
            });

            const fileName = `history-russia-${model}.json`;
            const filePath = join(__dirname, 'responses', fileName);
            await writeFile(filePath, JSON.stringify(result, null, 2));
            console.log(`Saved result to ${filePath}`);
            console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);
        } catch (error) {
            console.error(`Failed for model ${model}:`, error);
        }
    }

    console.log('Russia History Test Completed.');
}

main().catch(console.error);
