import { ChatGptContext, CreateImageInput, CreateImageOutput } from '../types';
import { calculateImagePrice } from '../pricing';

export const createImage =
    (ctx: ChatGptContext) =>
    async (input: CreateImageInput): Promise<CreateImageOutput> => {
        const { client, logger } = ctx;

        const model = input.model || 'dall-e-3';
        const mergedInput = {
            ...input,
            model,
        };

        logger?.debug('chat-gpt:createImage:start', { data: mergedInput });

        try {
            const response = await client.images.generate(mergedInput as any);

            const price = calculateImagePrice(model, input.size, input.quality, input.n);

            const output: CreateImageOutput = {
                created: response.created,
                data: response.data as any,
                price,
            };

            logger?.debug('chat-gpt:createImage:success', { data: output });

            return output;
        } catch (error) {
            logger?.debug('chat-gpt:createImage:error', { error });
            throw error;
        }
    };
