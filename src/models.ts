export const CHAT_GPT_MODELS = {
    GPT_4o: 'gpt-4o',
    GPT_4o_2024_08_06: 'gpt-4o-2024-08-06',
    GPT_4o_MINI: 'gpt-4o-mini',
    GPT_4o_MINI_2024_07_18: 'gpt-4o-mini-2024-07-18',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_4: 'gpt-4',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const;

export type ChatGptModel = (typeof CHAT_GPT_MODELS)[keyof typeof CHAT_GPT_MODELS];
