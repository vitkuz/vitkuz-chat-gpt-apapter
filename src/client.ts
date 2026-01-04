import OpenAI from 'openai';
import { ChatGptConfig } from './types';

export const createChatGptClient = (config: ChatGptConfig): OpenAI => {
    return new OpenAI({
        apiKey: config.apiKey,
        organization: config.organization,
        project: config.project,
    });
};
