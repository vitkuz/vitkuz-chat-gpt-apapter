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

const adapter = createAdapter(
    { apiKey },
    {
        debug: (msg, ctx) => console.log(`[DEBUG] ${msg}`, ctx),
    },
);

async function main() {
    try {
        console.log('Testing createChatCompletion with text...');
        const result = await adapter.createChatCompletion({
            model: CHAT_GPT_MODELS.GPT_4o,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Hello! How are you?' },
            ],
        });
        console.log('Text Result:', JSON.stringify(result.choices[0].message, null, 2));

        const resultPath = join(__dirname, 'create-chat-completion.result.json');
        await writeFile(resultPath, JSON.stringify(result, null, 2));
        console.log(`Saved text result to ${resultPath}`);

        console.log('\nTesting createChatCompletion with JSON Schema...');
        const jsonResult = await adapter.createChatCompletion({
            model: CHAT_GPT_MODELS.GPT_4o, // Or any other specific model if needed
            messages: [
                { role: 'system', content: 'Extract information from the text.' },
                { role: 'user', content: 'The weather in London is 15 degrees and sunny.' },
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'weather_report',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            location: { type: 'string' },
                            temperature: { type: 'number' },
                            condition: { type: 'string' },
                        },
                        required: ['location', 'temperature', 'condition'],
                        additionalProperties: false,
                    },
                },
            },
        });

        console.log('JSON Result:', jsonResult.choices[0].message.content);
        if (jsonResult.choices[0].message.content) {
            console.log('Parsed JSON:', JSON.parse(jsonResult.choices[0].message.content));
        }

        const jsonResultPath = join(__dirname, 'create-chat-completion-structured.result.json');
        await writeFile(jsonResultPath, JSON.stringify(jsonResult, null, 2));
        console.log(`Saved JSON schema result to ${jsonResultPath}`);

        console.log('SUCCESS');
    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
}

main();
