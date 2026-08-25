import { describe, it, expect, vi } from 'vitest';
import { addPhoto } from './gallery';

// Mock dependencies that we don't need for these early returns
vi.mock('@/lib/prisma', () => ({
  prisma: {
    photo: {
      create: vi.fn(),
    }
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('addPhoto validation edge cases', () => {
  it('returns error when url is missing', async () => {
    const formData = {
      get: (key) => (key === 'category' ? 'nature' : null)
    };

    const result = await addPhoto(formData);

    expect(result).toEqual({ success: false, error: 'URL and Category are required.' });
  });

  it('returns error when category is missing', async () => {
    const formData = {
      get: (key) => (key === 'url' ? 'http://example.com/photo.jpg' : null)
    };

    const result = await addPhoto(formData);

    expect(result).toEqual({ success: false, error: 'URL and Category are required.' });
  });

  it('returns error when both url and category are missing', async () => {
    const formData = {
      get: () => null
    };

    const result = await addPhoto(formData);

    expect(result).toEqual({ success: false, error: 'URL and Category are required.' });
  });
});
