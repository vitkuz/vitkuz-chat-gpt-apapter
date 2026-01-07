import OpenAI from 'openai';
import { z } from 'zod';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface PriceInfo {
    total: number;
    inputCost: number;
    outputCost: number;
    currency: string;
}

export interface ChatGptDefaults {
    model?: string;
    temperature?: number;
    response_format?: CreateChatCompletionInput['response_format'];
    schema?: z.ZodType;
    schemaName?: string;
}

export interface ChatGptConfig {
    apiKey: string;
    organization?: string;
    project?: string;
    defaults?: ChatGptDefaults;
}

export interface ChatGptContext {
    client: OpenAI;
    logger?: Logger;
    defaults?: ChatGptDefaults;
}

export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'tool' | 'developer';

export interface ChatMessage {
    role: ChatMessageRole;
    content: string;
    name?: string;
}

export interface CreateChatCompletionInput {
    model?: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    response_format?: {
        type: 'text' | 'json_object' | 'json_schema';
        json_schema?: {
            name: string;
            strict?: boolean;
            schema: Record<string, any>;
        };
    };
    schema?: z.ZodType;
    schemaName?: string;
    stop?: string | string[];
}

export interface CreateChatCompletionOutput {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: ChatMessage & {
            parsed?: any;
            refusal?: string;
        };
        finish_reason: string;
    }[];
    parsed?: any;
    refusal?: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_tokens_details?: {
            cached_tokens?: number;
        };
    };
    price?: PriceInfo;
}

export interface CreateImageInput {
    prompt: string;
    model?: string;
    n?: number;
    quality?: 'standard' | 'hd';
    response_format?: 'url' | 'b64_json';
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    style?: 'vivid' | 'natural';
    user?: string;
}

export interface CreateImageOutput {
    created: number;
    data: {
        url?: string;
        b64_json?: string;
        revised_prompt?: string;
    }[];
    price?: PriceInfo;
}

export interface CreateSpeechInput {
    model?: string;
    input: string;
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';
    speed?: number;
}

export interface CreateSpeechOutput {
    data: Buffer | Uint8Array;
    price?: PriceInfo;
}
