# @vitkuz/vitkuz-chat-gpt-apapter

A powerful and type-safe ChatGPT adapter for Node.js, featuring default configurations, Zod schema support for structured outputs, and a simplified interface.

## Features

- **Default Configuration**: Set default model, temperature, and schema at the adapter level.
- **Zod Support**: Get type-safe, parsed results using Zod schemas.
- **Responses API**: Leverages the latest OpenAI `responses` API for reliable structured outputs.
- **Model Constants**: Pre-defined constants for popular ChatGPT models.
- **Simplified Interface**: Cleaner code by reducing repetitive parameters.

## Installation

```bash
npm install @vitkuz/vitkuz-chat-gpt-apapter zod
```

## Quick Start

### 1. Initialize the Adapter

```typescript
import { createAdapter, CHAT_GPT_MODELS } from '@vitkuz/vitkuz-chat-gpt-apapter';

const adapter = createAdapter({
    apiKey: process.env.OPENAI_API_KEY,
    defaults: {
        model: CHAT_GPT_MODELS.GPT_4o_MINI,
        temperature: 0.7,
    }
});
```

### 2. Basic Completion

```typescript
const result = await adapter.createChatCompletion({
    messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(result.choices[0].message.content);
```

### 3. Structured Outputs with Zod

```typescript
import { z } from 'zod';

const UserSchema = z.object({
    name: z.string(),
    age: z.number(),
});

const result = await adapter.createChatCompletion({
    messages: [{ role: 'user', content: 'John is 30 years old.' }],
    schema: UserSchema,
    schemaName: 'user_info'
});

console.log(result.parsed); // Type-safe: { name: 'John', age: 30 }
```

## Overriding Defaults

You can always override the default configuration in any specific call:

```typescript
const result = await adapter.createChatCompletion({
    model: CHAT_GPT_MODELS.GPT_4o, // Use a more powerful model for this specific call
    temperature: 0, // Deterministic output
    messages: [...]
});
```

## API Reference

See [docs.md](./docs.md) for detailed information on types and configuration options.

## License

MIT
