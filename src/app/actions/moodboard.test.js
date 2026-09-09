import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => {
  class OpenAI {
    chat = {
      completions: {
        create: vi.fn(),
      },
    };
  }
  return { default: OpenAI };
});

describe('analyzeMoodboardAI fallback shape', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.NVIDIA_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
  });

  it('returns { success, data } when no API key is configured', async () => {
    const { analyzeMoodboardAI } = await import('./moodboard');
    const result = await analyzeMoodboardAI(['data:image/png;base64,abc']);

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      detectedTone: expect.any(String),
      presetName: expect.any(String),
      recommendedPackage: expect.any(String),
      matchScore: expect.any(Number),
      features: expect.any(Array),
    });
  });
});
