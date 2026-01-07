import { PriceInfo } from './types';

export interface ModelPricing {
    input: number; // cost per 1M tokens
    output: number; // cost per 1M tokens
    cachedInput?: number; // cost per 1M tokens
}

export interface ImagePricing {
    standard: Record<string, number>;
    hd: Record<string, number>;
}

export const CHAT_GPT_PRICING: Record<string, ModelPricing> = {
    // GPT-5 (Standard)
    'gpt-5.2': { input: 1.75, cachedInput: 0.175, output: 14.0 },
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5-mini': { input: 0.25, cachedInput: 0.025, output: 2.0 },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.4 },
    'gpt-5.2-pro': { input: 21.0, output: 168.0 },
    'gpt-5-pro': { input: 15.0, output: 120.0 },
    'gpt-5.2-chat-latest': { input: 1.75, cachedInput: 0.175, output: 14.0 },
    'gpt-5.1-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5.1-codex-max': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5.1-codex': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5-codex': { input: 1.25, cachedInput: 0.125, output: 10.0 },
    'gpt-5.1-codex-mini': { input: 0.25, cachedInput: 0.025, output: 2.0 },
    'gpt-5-search-api': { input: 1.25, cachedInput: 0.125, output: 10.0 },

    // GPT-4.1
    'gpt-4.1': { input: 2.0, cachedInput: 0.5, output: 8.0 },
    'gpt-4.1-mini': { input: 0.4, cachedInput: 0.1, output: 1.6 },
    'gpt-4.1-nano': { input: 0.1, cachedInput: 0.025, output: 0.4 },

    // GPT-4o
    'gpt-4o': { input: 2.5, cachedInput: 1.25, output: 10.0 },
    'gpt-4o-2024-05-13': { input: 5.0, output: 15.0 },
    'gpt-4o-2024-08-06': { input: 2.5, cachedInput: 1.25, output: 10.0 },
    'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
    'gpt-4o-mini-2024-07-18': { input: 0.15, cachedInput: 0.075, output: 0.6 },
    'gpt-4o-mini-search-preview': { input: 0.15, output: 0.6 },
    'gpt-4o-search-preview': { input: 2.5, output: 10.0 },

    // Reasoning Models (o-series)
    o1: { input: 15.0, cachedInput: 7.5, output: 60.0 },
    'o1-pro': { input: 150.0, output: 600.0 },
    'o1-mini': { input: 1.1, cachedInput: 0.55, output: 4.4 },
    o3: { input: 2.0, cachedInput: 0.5, output: 8.0 },
    'o3-pro': { input: 20.0, output: 80.0 },
    'o3-mini': { input: 1.1, cachedInput: 0.55, output: 4.4 },
    'o3-deep-research': { input: 10.0, cachedInput: 2.5, output: 40.0 },
    'o4-mini': { input: 1.1, cachedInput: 0.275, output: 4.4 },
    'o4-mini-deep-research': { input: 2.0, cachedInput: 0.5, output: 8.0 },

    // Realtime & Audio
    'gpt-realtime': { input: 4.0, cachedInput: 0.4, output: 16.0 },
    'gpt-realtime-mini': { input: 0.6, cachedInput: 0.06, output: 2.4 },
    'gpt-4o-realtime-preview': { input: 5.0, cachedInput: 2.5, output: 20.0 },
    'gpt-4o-mini-realtime-preview': { input: 0.6, cachedInput: 0.3, output: 2.4 },
    'gpt-audio': { input: 2.5, output: 10.0 },
    'gpt-audio-mini': { input: 0.6, output: 2.4 },
    'gpt-4o-audio-preview': { input: 2.5, output: 10.0 },
    'gpt-4o-mini-audio-preview': { input: 0.15, output: 0.6 },

    // Legacy / GPT-4 & 3.5
    'gpt-4-turbo': { input: 10.0, output: 30.0 },
    'gpt-4-turbo-2024-04-09': { input: 10.0, output: 30.0 },
    'gpt-4': { input: 30.0, output: 60.0 },
    'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    'gpt-3.5-turbo-instruct': { input: 1.5, output: 2.0 },

    // Specialized Preview
    'computer-use-preview': { input: 3.0, output: 12.0 },
};

export const IMAGE_PRICING: Record<string, ImagePricing> = {
    'dall-e-3': {
        standard: {
            '1024x1024': 0.04,
            '1024x1792': 0.08,
            '1792x1024': 0.08,
        },
        hd: {
            '1024x1024': 0.08,
            '1024x1792': 0.12,
            '1792x1024': 0.12,
        },
    },
    'dall-e-2': {
        standard: {
            '1024x1024': 0.02,
            '512x512': 0.018,
            '256x256': 0.016,
        },
        hd: {}, // no hd for dall-e-2
    },
};

export const SPEECH_PRICING: Record<string, number> = {
    tts: 15.0 / 1_000_000, // per character
    'tts-hd': 30.0 / 1_000_000, // per character
};

export const calculatePrice = (
    model: string,
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        input_tokens?: number;
        output_tokens?: number;
        prompt_tokens_details?: { cached_tokens?: number };
        input_tokens_details?: { cached_tokens?: number };
    },
): PriceInfo | undefined => {
    if (!usage) return undefined;

    const pricing = CHAT_GPT_PRICING[model];
    if (!pricing) return undefined;

    const inputTokens = usage.input_tokens ?? usage.prompt_tokens ?? 0;
    const outputTokens = usage.output_tokens ?? usage.completion_tokens ?? 0;
    const cachedTokens =
        usage.input_tokens_details?.cached_tokens ??
        usage.prompt_tokens_details?.cached_tokens ??
        0;

    const regularInputTokens = inputTokens - cachedTokens;

    const inputCost =
        (regularInputTokens / 1_000_000) * pricing.input +
        (cachedTokens / 1_000_000) * (pricing.cachedInput ?? pricing.input);

    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return {
        total: Number((inputCost + outputCost).toFixed(6)),
        inputCost: Number(inputCost.toFixed(6)),
        outputCost: Number(outputCost.toFixed(6)),
        currency: 'USD',
    };
};

export const calculateImagePrice = (
    model: string,
    size: string = '1024x1024',
    quality: string = 'standard',
    n: number = 1,
): PriceInfo | undefined => {
    const pricing = IMAGE_PRICING[model];
    if (!pricing) return undefined;

    const unitPrice =
        quality === 'hd'
            ? pricing.hd[size as keyof typeof pricing.hd]
            : pricing.standard[size as keyof typeof pricing.standard];

    if (unitPrice === undefined) return undefined;

    const total = unitPrice * n;

    return {
        total: Number(total.toFixed(6)),
        inputCost: 0,
        outputCost: total,
        currency: 'USD',
    };
};

export const calculateSpeechPrice = (model: string, inputLength: number): PriceInfo | undefined => {
    // Model in API is 'tts-1' or 'tts-1-hd'
    const priceKey = model.includes('hd') ? 'tts-hd' : 'tts';
    const rate = SPEECH_PRICING[priceKey];

    if (!rate) return undefined;

    const total = inputLength * rate;

    return {
        total: Number(total.toFixed(6)),
        inputCost: 0,
        outputCost: total,
        currency: 'USD',
    };
};
