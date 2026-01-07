import { ChatGptContext, CreateSpeechInput, CreateSpeechOutput } from '../types';
import { calculateSpeechPrice } from '../pricing';
import { CHAT_GPT_MODELS } from '../models';

export const createSpeech =
    (ctx: ChatGptContext) =>
        async (input: CreateSpeechInput): Promise<CreateSpeechOutput> => {
            const { client, logger } = ctx;

            const model = input.model || CHAT_GPT_MODELS.TTS_1;
            const mergedInput = {
                ...input,
                model,
            };

            logger?.debug('chat-gpt:createSpeech:start', { data: mergedInput });

            try {
                const response = await client.audio.speech.create(mergedInput as any);
                const buffer = Buffer.from(await response.arrayBuffer());

                const price = calculateSpeechPrice(model, input.input.length);

                const output: CreateSpeechOutput = {
                    data: buffer,
                    price,
                    input,
                };

                logger?.debug('chat-gpt:createSpeech:success', { data: { price } });

                return output;
            } catch (error) {
                logger?.debug('chat-gpt:createSpeech:error', { error });
                throw error;
            }
        };
