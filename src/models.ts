export const CHAT_GPT_MODELS = {
    // GPT-5
    GPT_5_2: 'gpt-5.2',
    GPT_5_1: 'gpt-5.1',
    GPT_5: 'gpt-5',
    GPT_5_MINI: 'gpt-5-mini',
    GPT_5_NANO: 'gpt-5-nano',
    GPT_5_2_PRO: 'gpt-5.2-pro',
    GPT_5_PRO: 'gpt-5-pro',
    GPT_5_2_CHAT_LATEST: 'gpt-5.2-chat-latest',
    GPT_5_1_CHAT_LATEST: 'gpt-5.1-chat-latest',
    GPT_5_CHAT_LATEST: 'gpt-5-chat-latest',
    GPT_5_1_CODEX_MAX: 'gpt-5.1-codex-max',
    GPT_5_1_CODEX: 'gpt-5.1-codex',
    GPT_5_CODEX: 'gpt-5-codex',
    GPT_5_1_CODEX_MINI: 'gpt-5.1-codex-mini',
    GPT_5_SEARCH_API: 'gpt-5-search-api',

    // GPT-4.1
    GPT_4_1: 'gpt-4.1',
    GPT_4_1_MINI: 'gpt-4.1-mini',
    GPT_4_1_NANO: 'gpt-4.1-nano',

    // GPT-4o
    GPT_4o: 'gpt-4o',
    GPT_4o_2024_08_06: 'gpt-4o-2024-08-06',
    GPT_4o_2024_05_13: 'gpt-4o-2024-05-13',
    GPT_4o_MINI: 'gpt-4o-mini',
    GPT_4o_MINI_2024_07_18: 'gpt-4o-mini-2024-07-18',
    GPT_4o_SEARCH_PREVIEW: 'gpt-4o-search-preview',
    GPT_4o_MINI_SEARCH_PREVIEW: 'gpt-4o-mini-search-preview',

    // Reasoning Models (o-series)
    O1: 'o1',
    O1_PRO: 'o1-pro',
    O1_MINI: 'o1-mini',
    O3: 'o3',
    O3_PRO: 'o3-pro',
    O3_MINI: 'o3-mini',
    O3_DEEP_RESEARCH: 'o3-deep-research',
    O4_MINI: 'o4-mini',
    O4_MINI_DEEP_RESEARCH: 'o4-mini-deep-research',

    // Realtime & Audio
    GPT_REALTIME: 'gpt-realtime',
    GPT_REALTIME_MINI: 'gpt-realtime-mini',
    GPT_4o_REALTIME_PREVIEW: 'gpt-4o-realtime-preview',
    GPT_4o_MINI_REALTIME_PREVIEW: 'gpt-4o-mini-realtime-preview',
    GPT_AUDIO: 'gpt-audio',
    GPT_AUDIO_MINI: 'gpt-audio-mini',
    GPT_4o_AUDIO_PREVIEW: 'gpt-4o-audio-preview',
    GPT_4o_MINI_AUDIO_PREVIEW: 'gpt-4o-mini-audio-preview',

    // Legacy / GPT-4 & 3.5
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_4: 'gpt-4',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
    GPT_3_5_TURBO_INSTRUCT: 'gpt-3.5-turbo-instruct',

    // Specialized Preview
    COMPUTER_USE_PREVIEW: 'computer-use-preview',

    // Image Generation Models
    DALL_E_3: 'dall-e-3',
    DALL_E_2: 'dall-e-2',

    // Text-to-Speech Models
    TTS_1: 'tts-1',
    TTS_1_HD: 'tts-1-hd',
} as const;

export type ChatGptModel = (typeof CHAT_GPT_MODELS)[keyof typeof CHAT_GPT_MODELS];

export const isStructuredOutputSupported = (model: string): boolean => {
    // Per OpenAI docs and pricing tiers:
    // GPT-4o, GPT-4o-mini, GPT-4o-2024-08-06 and later support it.
    // Also GPT-5 and GPT-4.1 series likely support it as next-gen models.

    if (model.startsWith('gpt-4o-mini')) return true;
    if (model.startsWith('gpt-4o-2024-08-06')) return true;
    if (model === 'gpt-4o') return true;

    if (model.startsWith('gpt-5')) return true;
    if (model.startsWith('gpt-4.1')) return true;

    // o1 and o3 series support structured outputs in recent versions
    if (model.startsWith('o1')) return true;
    if (model.startsWith('o3')) return true;
    if (model.startsWith('o4')) return true;

    return false;
};
