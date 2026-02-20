import { computeStats } from './statsEngine';
import { describe, it, expect } from 'vitest';

describe('Stats Engine', () => {
    it('computes basic stats correctly', () => {
        const scores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const stats = computeStats(scores);

        expect(stats.count).toBe(10);
        expect(stats.mean).toBe(55);
        expect(stats.median).toBe(55);
        expect(stats.min).toBe(10);
        expect(stats.max).toBe(100);
    });

    it('generates a correct histogram', () => {
        const scores = [5, 12, 15, 22]; // buckets: 0-10: 1, 10-20: 2, 20-30: 1
        const stats = computeStats(scores);

        const b0 = stats.histogram.find(b => b.bucket === '0-10');
        expect(b0.count).toBe(1);

        const b10 = stats.histogram.find(b => b.bucket === '10-20');
        expect(b10.count).toBe(2);

        const b20 = stats.histogram.find(b => b.bucket === '20-30');
        expect(b20.count).toBe(1);
    });

    it('handles empty scores cleanly', () => {
        const stats = computeStats([]);
        expect(stats.count).toBe(0);
        expect(stats.mean).toBe(0);
    });
});
