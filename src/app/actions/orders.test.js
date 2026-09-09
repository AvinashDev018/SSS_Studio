import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrder } from './orders';

const mockFindFirst = vi.fn();
const mockFindMany = vi.fn();
const mockBookingFindMany = vi.fn();
const mockBookingFindFirst = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: (...args) => mockFindFirst(...args),
      findMany: (...args) => mockFindMany(...args),
    },
    booking: {
      findMany: (...args) => mockBookingFindMany(...args),
      findFirst: (...args) => mockBookingFindFirst(...args),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

describe('getOrder', () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockFindMany.mockReset();
    mockBookingFindMany.mockReset();
    mockBookingFindFirst.mockReset();
    mockBookingFindMany.mockResolvedValue([]);
    mockBookingFindFirst.mockResolvedValue(null);
  });

  it('should return the order when found (happy path)', async () => {
    const mockOrder = { id: 1, orderId: 'ORD-123', status: 'PENDING' };
    mockFindFirst.mockResolvedValue(mockOrder);

    const result = await getOrder('ORD-123');

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        orderId: {
          equals: 'ORD-123',
          mode: 'insensitive',
        },
      },
    });
    expect(result).toEqual({ success: true, multiple: false, order: mockOrder });
  });

  it('should sanitize the orderId (trim whitespace and uppercase)', async () => {
    const mockOrder = { id: 1, orderId: 'ORD-ABC', status: 'PENDING' };
    mockFindFirst.mockResolvedValue(mockOrder);

    const result = await getOrder('  ord-abc  ');

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        orderId: {
          equals: 'ORD-ABC',
          mode: 'insensitive',
        },
      },
    });
    expect(result).toEqual({ success: true, multiple: false, order: mockOrder });
  });

  it('should return an error when the order is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await getOrder('ORD-999');

    expect(result).toEqual({ success: false, error: 'No order found with ID: ORD-999' });
  });

  it('should return a database error if Prisma throws an exception', async () => {
    mockFindFirst.mockRejectedValue(new Error('Database connection failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getOrder('ORD-ERR');

    expect(result).toEqual({ success: false, error: 'Database error. Please try again.' });
    consoleSpy.mockRestore();
  });
});
