export interface CandidateResult {
  filePath: string;

  finalSizeMB: number;

  compressionRatio: number;

  mse: number;

  qualityScore: number;

  score: number;
}

export const scoreCandidate = (
  originalSizeMB: number,
  finalSizeMB: number,
  mse: number,
  filePath: string,
): CandidateResult => {

  // Compression %
  const compressionRatio =
    (
      (
        originalSizeMB -
        finalSizeMB
      ) /
      originalSizeMB
    ) * 100;

  // Lower MSE => Higher score
  const qualityScore =
    1000 /
    (1 + mse);

  // Final score
  const score =
    compressionRatio * 0.3 +
    qualityScore * 0.7;

  return {
    filePath,

    finalSizeMB,

    compressionRatio,

    mse,

    qualityScore,

    score,
  };
};