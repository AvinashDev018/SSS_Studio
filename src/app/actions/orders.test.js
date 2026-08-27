import { getOrder } from './orders';
import { PrismaClient } from '@prisma/client';

// Mock the external modules
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

// Mock PrismaClient
const mockFindFirst = jest.fn();
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      order: {
        findFirst: (...args) => mockFindFirst(...args),
      },
      user: {
        findUnique: jest.fn(),
      },
    })),
  };
});

describe('getOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(result).toEqual({ success: true, order: mockOrder });
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
    expect(result).toEqual({ success: true, order: mockOrder });
  });

  it('should return an error when the order is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await getOrder('ORD-999');

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        orderId: {
          equals: 'ORD-999',
          mode: 'insensitive',
        },
      },
    });
    expect(result).toEqual({ success: false, error: 'No order found with ID: ORD-999' });
  });

  it('should return a database error if Prisma throws an exception', async () => {
    mockFindFirst.mockRejectedValue(new Error('Database connection failed'));

    // Mock console.error to prevent it from cluttering test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getOrder('ORD-ERR');

    expect(result).toEqual({ success: false, error: 'Database error. Please try again.' });

    consoleSpy.mockRestore();
  });
});
