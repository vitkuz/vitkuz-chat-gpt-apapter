import OpenAI from 'openai';
import { ChatGptConfig, ChatGptContext, Logger } from './types';
import { createChatGptClient } from './client';
import { createChatCompletion } from './operations/create-chat-completion';
import { createImage } from './operations/create-image';
import { createSpeech } from './operations/create-speech';

export interface ChatGptAdapter {
    createChatCompletion: ReturnType<typeof createChatCompletion>;
    createImage: ReturnType<typeof createImage>;
    createSpeech: ReturnType<typeof createSpeech>;
}

export const createAdapter = (config: ChatGptConfig, logger?: Logger): ChatGptAdapter => {
    const client = createChatGptClient(config);
    const context: ChatGptContext = { client, logger, defaults: config.defaults };

    return {
        createChatCompletion: createChatCompletion(context),
        createImage: createImage(context),
        createSpeech: createSpeech(context),
    };
};
