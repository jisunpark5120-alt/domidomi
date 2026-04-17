// Fallback metadata generator if actual audio processing is needed
export function generateAudioMetadata(blob) {
  return new Promise((resolve) => {
    // In a real implementation we could extract duration, volume peaks etc.
    // For now we just return basic info to pass to the API
    resolve({
      size: blob.size,
      type: blob.type,
      timestamp: Date.now()
    });
  });
}

export const METRIC_LABELS = {
  rhythm: '박자감',
  pitch: '음정 정확도',
  dynamics: '다이나믹스',
  pedal: '페달 사용',
  evenness: '균일성',
  leftHand: '왼손 완성도',
  rightHand: '오른손 완성도',
  expression: '표현력'
};
