import { ChatGptContext, CreateImageInput, CreateImageOutput } from '../types';
import { calculateImagePrice } from '../pricing';
import { CHAT_GPT_MODELS } from '../models';

export const createImage =
    (ctx: ChatGptContext) =>
        async (input: CreateImageInput): Promise<CreateImageOutput> => {
            const { client, logger } = ctx;

            let model = input.model || CHAT_GPT_MODELS.DALL_E_3;
            const supportedImageModels = [CHAT_GPT_MODELS.DALL_E_3, CHAT_GPT_MODELS.DALL_E_2];

            if (!supportedImageModels.includes(model as any)) {
                logger?.error('chat-gpt:createImage:unsupported-model', {
                    provided: model,
                    fallback: CHAT_GPT_MODELS.DALL_E_3,
                });
                model = CHAT_GPT_MODELS.DALL_E_3;
            }

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
                    model,
                    input,
                };

                logger?.debug('chat-gpt:createImage:success', { data: output });

                return output;
            } catch (error) {
                logger?.debug('chat-gpt:createImage:error', { error });
                throw error;
            }
        };
