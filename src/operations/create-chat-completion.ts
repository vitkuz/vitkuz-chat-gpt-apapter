import { zodTextFormat } from 'openai/helpers/zod';
import { ChatGptContext, CreateChatCompletionInput, CreateChatCompletionOutput } from '../types';
import { isStructuredOutputSupported } from '../models';
import { calculatePrice } from '../pricing';

export const createChatCompletion =
    (ctx: ChatGptContext) =>
    async (input: CreateChatCompletionInput): Promise<CreateChatCompletionOutput> => {
        const { client, logger, defaults } = ctx;

        const mergedInput = {
            ...defaults,
            ...input,
        };

        if (!mergedInput.model) {
            throw new Error('chat-gpt:createChatCompletion: model is required');
        }

        const { schema, schemaName, messages, ...rest } = mergedInput;

        logger?.debug('chat-gpt:createChatCompletion:start', { data: mergedInput });

        try {
            let response: any;
            if (schema) {
                if (!isStructuredOutputSupported(mergedInput.model)) {
                    throw new Error(
                        `chat-gpt:createChatCompletion: model ${mergedInput.model} does not support Structured Outputs. ` +
                            'See https://platform.openai.com/docs/guides/structured-outputs#supported-models',
                    );
                }

                response = await (client.responses as any).parse({
                    ...rest,
                    input: messages,
                    text: {
                        format: zodTextFormat(schema, schemaName || 'output'),
                    },
                });

                response = {
                    ...response,
                    parsed: response.output_parsed,
                };
            } else {
                // Fallback to regular chat completion for non-zod calls
                response = await client.chat.completions.create({
                    ...mergedInput,
                } as any);
            }

            const price = calculatePrice(mergedInput.model, response.usage);

            const output = {
                ...response,
                price,
                input,
            } as CreateChatCompletionOutput;

            logger?.debug('chat-gpt:createChatCompletion:success', { data: output });

            return output;
        } catch (error) {
            logger?.debug('chat-gpt:createChatCompletion:error', { error });
            throw error;
        }
    };
