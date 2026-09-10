import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('analyzeMoodboardAI legacy action', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns flat featuresText (no nested features array) for Flight safety', async () => {
    const { analyzeMoodboardAI } = await import('./moodboard');
    const result = await analyzeMoodboardAI(['data:image/png;base64,abc']);

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      detectedTone: expect.any(String),
      presetName: expect.any(String),
      recommendedPackage: expect.any(String),
      matchScore: expect.any(Number),
      featuresText: expect.any(String),
    });
    expect(result.data.features).toBeUndefined();
  });
});
