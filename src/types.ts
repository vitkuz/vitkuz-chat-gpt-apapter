import OpenAI from 'openai';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface ChatGptConfig {
    apiKey: string;
    organization?: string;
    project?: string;
}

export interface ChatGptContext {
    client: OpenAI;
    logger?: Logger;
}

export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'tool' | 'developer';

export interface ChatMessage {
    role: ChatMessageRole;
    content: string;
    name?: string;
}

export interface CreateChatCompletionInput {
    model: string;
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
    stop?: string | string[];
}

export interface CreateChatCompletionOutput {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: ChatMessage;
        finish_reason: string;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
