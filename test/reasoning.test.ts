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

async function main() {
    console.log('Starting Reasoning Model Test...');

    // Using o3-mini as it's available and efficient
    const model = CHAT_GPT_MODELS.O3_MINI;

    try {
        console.log(`Testing reasoning model: ${model}`);
        const result = await adapter.createChatCompletion({
            model,
            messages: [
                {
                    role: 'user',
                    content: `A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Explain your reasoning step-by-step.`,
                },
            ],
        });

        const fileName = `reasoning-${model}.json`;
        const filePath = join(__dirname, 'responses', fileName);
        await writeFile(filePath, JSON.stringify(result, null, 2));

        console.log(`Saved result to ${filePath}`);
        console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);
        console.log(`Response: ${result.choices[0].message.content}`);
    } catch (error) {
        console.error(`Failed for model ${model}:`, error);
    }

    console.log('Reasoning Model Test Completed.');
}

main().catch(console.error);
