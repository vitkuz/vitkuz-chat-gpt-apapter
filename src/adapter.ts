import OpenAI from 'openai';
import { ChatGptConfig, ChatGptContext, Logger } from './types';
import { createChatGptClient } from './client';
import { createChatCompletion } from './operations/create-chat-completion';

export interface ChatGptAdapter {
    createChatCompletion: ReturnType<typeof createChatCompletion>;
}

export const createAdapter = (config: ChatGptConfig, logger?: Logger): ChatGptAdapter => {
    const client = createChatGptClient(config);
    const context: ChatGptContext = { client, logger, defaults: config.defaults };

    return {
        createChatCompletion: createChatCompletion(context),
    };
};
