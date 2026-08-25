import { describe, expect, test } from 'vitest';
import { getDatePricing } from './pricingEngine';

describe('getDatePricing', () => {
  const cases = [
    {
      description: 'Public Holiday (Republic Day - Friday)',
      date: new Date(2024, 0, 26),
      expected: {
        tier: 'luxury',
        label: 'Holiday',
        discount: -15,
        badgeColor: 'rose',
        message: '🎊 Holiday Premium: +15% applies on public holidays.',
      },
    },
    {
      description: 'Sunday (High Demand)',
      date: new Date(2024, 2, 3), // March 3, 2024
      expected: {
        tier: 'peak',
        label: 'High Demand',
        discount: 0,
        badgeColor: 'amber',
        message: '🔥 Sunday is a high-demand day. Book early!',
      },
    },
    {
      description: 'Saturday in Peak Season (November)',
      date: new Date(2024, 10, 16), // Nov 16, 2024
      expected: {
        tier: 'peak',
        label: 'Peak Season',
        discount: -10,
        badgeColor: 'amber',
        message: '⭐ Peak wedding season Saturday: +10% applies.',
      },
    },
    {
      description: 'Saturday in Off-Peak Season (March)',
      date: new Date(2024, 2, 2), // March 2, 2024
      expected: {
        tier: 'peak',
        label: 'High Demand',
        discount: 0,
        badgeColor: 'amber',
        message: '🔥 Saturday is a popular booking day!',
      },
    },
    {
      description: 'Friday (Standard)',
      date: new Date(2024, 2, 1), // March 1, 2024
      expected: {
        tier: 'standard',
        label: 'Standard',
        discount: 0,
        badgeColor: 'zinc',
        message: '📅 Standard pricing applies.',
      },
    },
    {
      description: 'Weekday (Monday - Saver Date)',
      date: new Date(2024, 2, 4), // March 4, 2024
      expected: {
        tier: 'saver',
        label: 'Saver Date',
        discount: 10,
        badgeColor: 'green',
        message: '🎉 Weekday Saver! Book today and get 10% off your session.',
      },
    },
  ];

  test.each(cases)('should return correct pricing for $description', ({ date, expected }) => {
    const result = getDatePricing(date);
    expect(result).toEqual(expected);
  });
});
