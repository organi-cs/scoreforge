/**
 * Core Statistics logic
 */

export function computeStats(scores) {
    if (!scores || scores.length === 0) {
        return {
            mean: 0, median: 0, stdDev: 0, min: 0, max: 0, count: 0,
            percentiles: { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 },
            histogram: []
        };
    }

    const sorted = [...scores].sort((a, b) => a - b);
    const count = sorted.length;

    const min = sorted[0];
    const max = sorted[count - 1];

    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    const getPercentile = (p) => {
        const idx = (p / 100) * (count - 1);
        if (Number.isInteger(idx)) return sorted[idx];
        const lower = Math.floor(idx);
        const upper = Math.ceil(idx);
        const weight = idx - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    };

    const median = getPercentile(50);

    const variance = sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    // Simple Histogram: buckets of 10
    const bucketSize = 10;
    // Determine highest boundary multiple of 10
    const maxBucket = Math.ceil(max / bucketSize) * bucketSize;
    const histogramMap = {};

    // Initialize buckets up to the max score seen (or 100 if none)
    const topBucketBoundary = Math.max(100, maxBucket);
    for (let i = 0; i < topBucketBoundary; i += bucketSize) {
        const label = `${i}-${i + bucketSize}`;
        histogramMap[label] = 0;
    }

    sorted.forEach(score => {
        // Find bucket
        const lowerBound = Math.floor(score / bucketSize) * bucketSize;
        // Edge case: score exactly matches a highest boundary (like 100)
        const normalizedLowerBound = lowerBound >= topBucketBoundary ? topBucketBoundary - bucketSize : lowerBound;
        const label = `${normalizedLowerBound}-${normalizedLowerBound + bucketSize}`;
        if (histogramMap[label] !== undefined) {
            histogramMap[label]++;
        }
    });

    const histogram = Object.keys(histogramMap).map(bucket => ({
        bucket,
        count: histogramMap[bucket]
    }));

    return {
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        stdDev: Number(stdDev.toFixed(2)),
        min,
        max,
        count,
        percentiles: {
            p10: Number(getPercentile(10).toFixed(2)),
            p25: Number(getPercentile(25).toFixed(2)),
            p50: Number(getPercentile(50).toFixed(2)),
            p75: Number(getPercentile(75).toFixed(2)),
            p90: Number(getPercentile(90).toFixed(2)),
        },
        histogram
    };
}
