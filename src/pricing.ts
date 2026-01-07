import { PriceInfo } from './types';

export interface ModelPricing {
    input: number; // cost per 1M tokens
    output: number; // cost per 1M tokens
    cachedInput?: number; // cost per 1M tokens
}

export const CHAT_GPT_PRICING: Record<string, ModelPricing> = {
    // GPT-5 (Standard)
    'gpt-5.2': { input: 1.75, cachedInput: 0.175, output: 14.00 },
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5-mini': { input: 0.25, cachedInput: 0.025, output: 2.00 },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.40 },
    'gpt-5.2-pro': { input: 21.00, output: 168.00 },
    'gpt-5-pro': { input: 15.00, output: 120.00 },
    'gpt-5.2-chat-latest': { input: 1.75, cachedInput: 0.175, output: 14.00 },
    'gpt-5.1-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5.1-codex-max': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5.1-codex': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5-codex': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5.1-codex-mini': { input: 0.25, cachedInput: 0.025, output: 2.00 },
    'gpt-5-search-api': { input: 1.25, cachedInput: 0.125, output: 10.00 },

    // GPT-4.1
    'gpt-4.1': { input: 2.00, cachedInput: 0.50, output: 8.00 },
    'gpt-4.1-mini': { input: 0.40, cachedInput: 0.10, output: 1.60 },
    'gpt-4.1-nano': { input: 0.10, cachedInput: 0.025, output: 0.40 },

    // GPT-4o
    'gpt-4o': { input: 2.50, cachedInput: 1.25, output: 10.00 },
    'gpt-4o-2024-05-13': { input: 5.00, output: 15.00 },
    'gpt-4o-2024-08-06': { input: 2.50, cachedInput: 1.25, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.60 },
    'gpt-4o-mini-2024-07-18': { input: 0.15, cachedInput: 0.075, output: 0.60 },
    'gpt-4o-mini-search-preview': { input: 0.15, output: 0.60 },
    'gpt-4o-search-preview': { input: 2.50, output: 10.00 },

    // Reasoning Models (o-series)
    'o1': { input: 15.00, cachedInput: 7.50, output: 60.00 },
    'o1-pro': { input: 150.00, output: 600.00 },
    'o1-mini': { input: 1.10, cachedInput: 0.55, output: 4.40 },
    'o3': { input: 2.00, cachedInput: 0.50, output: 8.00 },
    'o3-pro': { input: 20.00, output: 80.00 },
    'o3-mini': { input: 1.10, cachedInput: 0.55, output: 4.40 },
    'o3-deep-research': { input: 10.00, cachedInput: 2.50, output: 40.00 },
    'o4-mini': { input: 1.10, cachedInput: 0.275, output: 4.40 },
    'o4-mini-deep-research': { input: 2.00, cachedInput: 0.50, output: 8.00 },

    // Realtime & Audio
    'gpt-realtime': { input: 4.00, cachedInput: 0.40, output: 16.00 },
    'gpt-realtime-mini': { input: 0.60, cachedInput: 0.06, output: 2.40 },
    'gpt-4o-realtime-preview': { input: 5.00, cachedInput: 2.50, output: 20.00 },
    'gpt-4o-mini-realtime-preview': { input: 0.60, cachedInput: 0.30, output: 2.40 },
    'gpt-audio': { input: 2.50, output: 10.00 },
    'gpt-audio-mini': { input: 0.60, output: 2.40 },
    'gpt-4o-audio-preview': { input: 2.50, output: 10.00 },
    'gpt-4o-mini-audio-preview': { input: 0.15, output: 0.60 },

    // Legacy / GPT-4 & 3.5
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
    'gpt-4-turbo-2024-04-09': { input: 10.00, output: 30.00 },
    'gpt-4': { input: 30.00, output: 60.00 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    'gpt-3.5-turbo-instruct': { input: 1.50, output: 2.00 },

    // Specialized Preview
    'computer-use-preview': { input: 3.00, output: 12.00 },
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
    const cachedTokens = usage.input_tokens_details?.cached_tokens ?? usage.prompt_tokens_details?.cached_tokens ?? 0;

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
