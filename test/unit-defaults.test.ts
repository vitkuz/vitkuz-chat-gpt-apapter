import { z } from 'zod';
import { createAdapter, CHAT_GPT_MODELS } from '../src/index';

// Mock OpenAI client
const mockClient = {
    responses: {
        parse: async (input: any) => {
            return { _receivedInput: input, output_parsed: { success: true } };
        }
    },
    chat: {
        completions: {
            create: async (input: any) => {
                return { _receivedInput: input }; // Return back what we received for verification
            }
        }
    }
} as any;

// To test this properly without real client creation, we can't use createAdapter easily 
// unless we expose a way to inject the client or just test createChatCompletion directly.
// In src/adapter.ts, createChatGptClient(config) is called.

import { createChatCompletion } from '../src/operations/create-chat-completion';

async function testDefaults() {
    console.log('Running unit test for defaults merging...');

    const contextWithDefaults = {
        client: mockClient,
        defaults: {
            model: CHAT_GPT_MODELS.GPT_4o,
            temperature: 0.5,
            response_format: { type: 'text' } as const
        }
    };

    const completion = createChatCompletion(contextWithDefaults as any);

    // 1. Test using only defaults
    console.log('Case 1: Using only defaults');
    const res1 = await completion({
        messages: [{ role: 'user', content: 'test' }]
    }) as any;

    if (res1._receivedInput.model !== CHAT_GPT_MODELS.GPT_4o) throw new Error('Model default failed');
    if (res1._receivedInput.temperature !== 0.5) throw new Error('Temperature default failed');
    console.log('Case 1 passed');

    // 2. Test overriding model
    console.log('Case 2: Overriding model');
    const res2 = await completion({
        model: CHAT_GPT_MODELS.GPT_4o_MINI,
        messages: [{ role: 'user', content: 'test' }]
    }) as any;

    if (res2._receivedInput.model !== CHAT_GPT_MODELS.GPT_4o_MINI) throw new Error('Model override failed');
    if (res2._receivedInput.temperature !== 0.5) throw new Error('Default temperature should have been kept');
    console.log('Case 2 passed');

    // 3. Test overriding temperature
    console.log('Case 3: Overriding temperature');
    const res3 = await completion({
        temperature: 0.9,
        messages: [{ role: 'user', content: 'test' }]
    }) as any;

    if (res3._receivedInput.temperature !== 0.9) throw new Error('Temperature override failed');
    if (res3._receivedInput.model !== CHAT_GPT_MODELS.GPT_4o) throw new Error('Default model should have been kept');
    console.log('Case 3 passed');

    // 4. Test error when no model provided
    console.log('Case 4: No model provided');
    const emptyCompletion = createChatCompletion({ client: mockClient } as any);
    try {
        await emptyCompletion({ messages: [] });
        throw new Error('Should have thrown error for missing model');
    } catch (e: any) {
        if (e.message !== 'chat-gpt:createChatCompletion: model is required') throw e;
        console.log('Case 4 passed (Error caught correctly)');
    }

    // 5. Test Zod schema
    console.log('Case 5: Zod schema');
    const Schema = z.object({ foo: z.string() });
    const completionWithSchema = createChatCompletion({
        client: mockClient,
        defaults: {
            model: CHAT_GPT_MODELS.GPT_4o,
            schema: Schema,
            schemaName: 'test_schema'
        }
    } as any);

    const res5 = await completionWithSchema({
        messages: [{ role: 'user', content: 'test schema' }]
    }) as any;

    if (res5.parsed.success !== true) throw new Error('Parsed output mapping failed');
    if (!res5._receivedInput.text?.format?.schema) throw new Error('zodTextFormat was not applied');
    if (res5._receivedInput.text?.format?.name !== 'test_schema') throw new Error('schemaName was not applied');
    console.log('Case 5 passed');

    console.log('ALL UNIT TESTS PASSED');
}

testDefaults().catch(err => {
    console.error('TEST FAILED:', err);
    process.exit(1);
});
