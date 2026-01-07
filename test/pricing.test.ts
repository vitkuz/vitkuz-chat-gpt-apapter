import { calculatePrice, calculateImagePrice, calculateSpeechPrice } from '../src/pricing';

async function testPricing() {
    console.log('Running pricing tests...');

    // 1. gpt-4o-mini normal
    console.log('Case 1: gpt-4o-mini normal');
    const p1 = calculatePrice('gpt-4o-mini', {
        prompt_tokens: 1_000_000,
        completion_tokens: 1_000_000,
    });
    // (1M / 1M) * 0.15 + (1M / 1M) * 0.60 = 0.15 + 0.60 = 0.75
    if (p1?.total !== 0.75) throw new Error(`Incorrect price p1: ${p1?.total}`);

    // 2. gpt-4o-mini with cached tokens
    console.log('Case 2: gpt-4o-mini cached');
    const p2 = calculatePrice('gpt-4o-mini', {
        prompt_tokens: 1_000_000,
        completion_tokens: 1_000_000,
        prompt_tokens_details: { cached_tokens: 500_000 },
    });
    // (500k regular / 1M) * 0.15 + (500k cached / 1M) * 0.075 + (1M / 1M) * 0.60
    // 0.075 + 0.0375 + 0.60 = 0.7125
    if (p2?.total !== 0.7125) throw new Error(`Incorrect price p2: ${p2?.total}`);

    // 3. gpt-4o
    console.log('Case 3: gpt-4o');
    const p3 = calculatePrice('gpt-4o', {
        prompt_tokens: 1000,
        completion_tokens: 1000,
    });
    // (1000 / 1M) * 2.50 + (1000 / 1M) * 10.00 = 0.0025 + 0.01 = 0.0125
    if (p3?.total !== 0.0125) throw new Error(`Incorrect price p3: ${p3?.total}`);

    // 4. Unknown model
    console.log('Case 4: Unknown model');
    const p4 = calculatePrice('unknown', { prompt_tokens: 100, completion_tokens: 100 });
    if (p4 !== undefined) throw new Error('Should be undefined for unknown model');

    // 5. input_tokens / output_tokens (Responses API style)
    console.log('Case 5: input_tokens / output_tokens');
    const p5 = calculatePrice('gpt-4o-mini', {
        input_tokens: 1_000_000,
        output_tokens: 1_000_000,
    } as any);
    if (p5?.total !== 0.75) throw new Error(`Incorrect price p5: ${p5?.total}`);

    // 6. Image pricing
    console.log('Case 6: Image pricing');
    const p6 = calculateImagePrice('dall-e-3', '1024x1024', 'standard', 1);
    if (p6?.total !== 0.04) throw new Error(`Incorrect price p6: ${p6?.total}`);

    const p6_hd = calculateImagePrice('dall-e-3', '1024x1792', 'hd', 2);
    // 0.12 * 2 = 0.24
    if (p6_hd?.total !== 0.24) throw new Error(`Incorrect price p6_hd: ${p6_hd?.total}`);

    // 7. Speech pricing
    console.log('Case 7: Speech pricing');
    const p7 = calculateSpeechPrice('tts-1', 1000);
    // (1000 * 15) / 1M = 0.015
    if (p7?.total !== 0.015) throw new Error(`Incorrect price p7: ${p7?.total}`);

    const p7_hd = calculateSpeechPrice('tts-1-hd', 1000);
    // (1000 * 30) / 1M = 0.03
    if (p7_hd?.total !== 0.03) throw new Error(`Incorrect price p7_hd: ${p7_hd?.total}`);

    console.log('ALL PRICING TESTS PASSED');
}

testPricing().catch((err) => {
    console.error('TEST FAILED:', err);
    process.exit(1);
});
