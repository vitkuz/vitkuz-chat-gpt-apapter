import { ChatGptContext, CreateChatCompletionInput, CreateChatCompletionOutput } from '../types';

export const createChatCompletion =
    (ctx: ChatGptContext) =>
    async (input: CreateChatCompletionInput): Promise<CreateChatCompletionOutput> => {
        const { client, logger } = ctx;

        logger?.debug('chat-gpt:createChatCompletion:start', { data: input });

        try {
            const response = await client.chat.completions.create(input as any);

            logger?.debug('chat-gpt:createChatCompletion:success', { data: response });

            return response as CreateChatCompletionOutput;
        } catch (error) {
            logger?.debug('chat-gpt:createChatCompletion:error', { error });
            throw error;
        }
    };
