export interface ModelPricing {
    input: number; // cost per 1M tokens
    output: number; // cost per 1M tokens
    cachedInput?: number; // cost per 1M tokens
}

export interface PriceInfo {
    total: number;
    inputCost: number;
    outputCost: number;
    currency: string;
}

export const CHAT_GPT_PRICING: Record<string, ModelPricing> = {
    // GPT-5 (Standard)
    'gpt-5.2': { input: 1.75, cachedInput: 0.175, output: 14.00 },
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5': { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5-mini': { input: 0.25, cachedInput: 0.025, output: 2.00 },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.40 },

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

    // Reasoning Models
    'o1': { input: 15.00, cachedInput: 7.50, output: 60.00 },
    'o1-mini': { input: 1.10, cachedInput: 0.55, output: 4.40 },
    'o3': { input: 2.00, cachedInput: 0.50, output: 8.00 },
    'o3-mini': { input: 1.10, cachedInput: 0.55, output: 4.40 },
    'o4-mini': { input: 1.10, cachedInput: 0.275, output: 4.40 },

    // Legacy/Other
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
    'gpt-4-turbo-2024-04-09': { input: 10.00, output: 30.00 },
    'gpt-4': { input: 30.00, output: 60.00 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
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
