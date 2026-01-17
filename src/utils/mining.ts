import { DataRow } from '../types';

/**
 * Simple Linear Regression
 * y = mx + b
 */
export const calculateLinearRegression = (data: DataRow[], xCol: string, yCol: string) => {
    const points = data
        .map(row => ({
            x: Number(row[xCol]),
            y: Number(row[yCol])
        }))
        .filter(p => !isNaN(p.x) && !isNaN(p.y));

    if (points.length < 2) return null;

    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared calculation
    const meanY = sumY / n;
    const ssTot = points.reduce((acc, p) => acc + Math.pow(p.y - meanY, 2), 0);
    const ssRes = points.reduce((acc, p) => acc + Math.pow(p.y - (slope * p.x + intercept), 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    return {
        slope,
        intercept,
        rSquared,
        points,
        predict: (x: number) => slope * x + intercept
    };
};

/**
 * K-Means Clustering (simplified)
 */
export const calculateKMeans = (data: DataRow[], columns: string[], k: number, maxIterations = 50) => {
    // Extract vectors
    const vectors = data.map(row => {
        const vec = columns.map(col => Number(row[col]));
        return vec.some(isNaN) ? null : vec;
    }).filter(v => v !== null) as number[][];

    if (vectors.length < k) return null;

    // Initialize centroids randomly
    let centroids = vectors.slice(0, k);
    let assignments = new Array(vectors.length).fill(0);

    for (let iter = 0; iter < maxIterations; iter++) {
        // Assign points to nearest centroid
        let changed = false;
        assignments = vectors.map((vec, idx) => {
            let minDist = Infinity;
            let cluster = 0;
            centroids.forEach((centroid, cIdx) => {
                const dist = Math.sqrt(vec.reduce((acc, val, i) => acc + Math.pow(val - centroid[i], 2), 0));
                if (dist < minDist) {
                    minDist = dist;
                    cluster = cIdx;
                }
            });
            if (assignments[idx] !== cluster) changed = true;
            return cluster;
        });

        if (!changed) break;

        // Recalculate centroids
        centroids = centroids.map((_, cIdx) => {
            const clusterPoints = vectors.filter((_, i) => assignments[i] === cIdx);
            if (clusterPoints.length === 0) return centroids[cIdx]; // Avoid division by zero

            const newCentroid = new Array(columns.length).fill(0);
            clusterPoints.forEach(p => {
                p.forEach((val, dim) => newCentroid[dim] += val);
            });
            return newCentroid.map(val => val / clusterPoints.length);
        });
    }

    return {
        centroids,
        assignments: assignments // mapping of valid rows to cluster ID
    };
};
