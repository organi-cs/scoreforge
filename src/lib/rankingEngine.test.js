import { computeRankings } from './rankingEngine';
import { describe, it, expect } from 'vitest';

describe('Ranking Engine', () => {
    const rounds = [
        { id: 'r1', weight: 0.4 },
        { id: 'r2', weight: 0.6 }
    ];

    it('computes basic weighted totals and ranks correctly', () => {
        const participants = [
            { id: 1, categoryId: 'cat1', scores: { r1: 100, r2: 100 } }, // 100
            { id: 2, categoryId: 'cat1', scores: { r1: 50, r2: 50 } },   // 50
            { id: 3, categoryId: 'cat1', scores: { r1: 0, r2: 100 } },   // 60
        ];

        const results = computeRankings(participants, rounds, { method: 'fixedCount', gold: 1 });

        expect(results.find(p => p.id === 1).totalWeighted).toBe(100);
        expect(results.find(p => p.id === 1).rank.inCategory).toBe(1);
        expect(results.find(p => p.id === 1).medal).toBe('gold');

        expect(results.find(p => p.id === 3).totalWeighted).toBe(60);
        expect(results.find(p => p.id === 3).rank.inCategory).toBe(2);
        expect(results.find(p => p.id === 3).medal).toBe(null);

        expect(results.find(p => p.id === 2).totalWeighted).toBe(50);
        expect(results.find(p => p.id === 2).rank.inCategory).toBe(3);
    });

    it('handles ties correctly', () => {
        const participants = [
            { id: 1, categoryId: 'cat1', scores: { r1: 100, r2: 100 } }, // 100
            { id: 2, categoryId: 'cat1', scores: { r1: 100, r2: 100 } }, // 100
            { id: 3, categoryId: 'cat1', scores: { r1: 50, r2: 50 } },   // 50
        ];

        // fixedCount: 1 gold. But two people tied for 1st.
        const results = computeRankings(participants, rounds, { method: 'fixedCount', gold: 1 });

        const p1 = results.find(p => p.id === 1);
        const p2 = results.find(p => p.id === 2);
        const p3 = results.find(p => p.id === 3);

        expect(p1.rank.inCategory).toBe(1);
        expect(p2.rank.inCategory).toBe(1);
        expect(p3.rank.inCategory).toBe(3); // Rank skip! 1, 1, 3.

        // Both should get gold because they tied for rank 1
        expect(p1.medal).toBe('gold');
        expect(p2.medal).toBe('gold');
    });

    it('calculates percentages correctly', () => {
        const participants = [
            { id: 1, categoryId: 'c1', scores: { r1: 100, r2: 100 } },
            { id: 2, categoryId: 'c1', scores: { r1: 90, r2: 90 } },
            { id: 3, categoryId: 'c1', scores: { r1: 80, r2: 80 } },
            { id: 4, categoryId: 'c1', scores: { r1: 70, r2: 70 } },
            { id: 5, categoryId: 'c1', scores: { r1: 60, r2: 60 } },
        ]; // 5 people

        // 20% gold = 1, 20% silver = 1, 20% bronze = 1
        const rules = { method: 'percentage', gold: 20, silver: 20, bronze: 20 };
        const results = computeRankings(participants, rounds, rules);

        expect(results.find(p => p.id === 1).medal).toBe('gold');
        expect(results.find(p => p.id === 2).medal).toBe('silver');
        expect(results.find(p => p.id === 3).medal).toBe('bronze');
        expect(results.find(p => p.id === 4).medal).toBe(null);
    });
});
