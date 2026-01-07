import OpenAI from 'openai';
import { ChatGptContext, CreateTranscriptionInput, CreateTranscriptionOutput } from '../types';
import { calculateTranscriptionPrice } from '../pricing';
import { CHAT_GPT_MODELS } from '../models';

export const createTranscription =
    (ctx: ChatGptContext) =>
    async (input: CreateTranscriptionInput): Promise<CreateTranscriptionOutput> => {
        const { client, logger } = ctx;

        let model = input.model || CHAT_GPT_MODELS.WHISPER_1;
        const supportedModels = [
            CHAT_GPT_MODELS.WHISPER_1,
            CHAT_GPT_MODELS.GPT_4o_TRANSCRIBE,
            CHAT_GPT_MODELS.GPT_4o_MINI_TRANSCRIBE,
        ];

        if (!supportedModels.includes(model as any)) {
            logger?.error('chat-gpt:createTranscription:unsupported-model', {
                provided: model,
                fallback: CHAT_GPT_MODELS.WHISPER_1,
            });
            model = CHAT_GPT_MODELS.WHISPER_1;
        }

        const { file, ...rest } = input;
        const mergedInput = {
            ...rest,
            model,
            file: await OpenAI.toFile(file, 'audio.mp3'),
        };

        logger?.debug('chat-gpt:createTranscription:start', {
            data: { ...mergedInput, file: '[Buffer]' },
        });

        try {
            // We use verbose_json to get duration and other details
            const response = await client.audio.transcriptions.create({
                ...mergedInput,
                response_format: input.response_format || 'verbose_json',
            } as any);

            const transcription = response as any;
            const duration = transcription.duration || 0;
            const price = calculateTranscriptionPrice(model, duration);

            const output: CreateTranscriptionOutput = {
                text: transcription.text,
                duration: transcription.duration,
                language: transcription.language,
                words: transcription.words,
                segments: transcription.segments,
                price,
                model,
                input,
            };

            logger?.debug('chat-gpt:createTranscription:success', { data: { price } });

            return output;
        } catch (error) {
            logger?.debug('chat-gpt:createTranscription:error', { error });
            throw error;
        }
    };
