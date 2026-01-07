import { zodTextFormat } from 'openai/helpers/zod';
import { ChatGptContext, CreateChatCompletionInput, CreateChatCompletionOutput } from '../types';
import { isStructuredOutputSupported } from '../models';

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
                if (schema) {
                    if (!isStructuredOutputSupported(mergedInput.model)) {
                        throw new Error(
                            `chat-gpt:createChatCompletion: model ${mergedInput.model} does not support Structured Outputs. ` +
                            'See https://platform.openai.com/docs/guides/structured-outputs#supported-models',
                        );
                    }

                    const response = await (client.responses as any).parse({
                        ...rest,
                        input: messages,
                        text: {
                            format: zodTextFormat(schema, schemaName || 'output'),
                        },
                    });

                    logger?.debug('chat-gpt:createChatCompletion:success', { data: response });

                    return {
                        ...response,
                        parsed: response.output_parsed,
                    } as CreateChatCompletionOutput;
                }

                // Fallback to regular chat completion for non-zod calls
                // or we can use client.responses.create if we want to be consistent
                const response = await client.chat.completions.create({
                    ...mergedInput,
                } as any);

                logger?.debug('chat-gpt:createChatCompletion:success', { data: response });

                return response as CreateChatCompletionOutput;
            } catch (error) {
                logger?.debug('chat-gpt:createChatCompletion:error', { error });
                throw error;
            }
        };
