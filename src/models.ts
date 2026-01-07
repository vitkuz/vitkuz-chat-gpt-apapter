export const CHAT_GPT_MODELS = {
    GPT_4o: 'gpt-4o',
    GPT_4o_MINI: 'gpt-4o-mini',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_4: 'gpt-4',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const;

export type ChatGptModel = (typeof CHAT_GPT_MODELS)[keyof typeof CHAT_GPT_MODELS];
