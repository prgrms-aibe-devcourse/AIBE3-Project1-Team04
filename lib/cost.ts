export const formatCost = (cost: number) => {
  if (cost === 0) return '무료';
  if (cost >= 10000) {
    return `${(cost / 10000).toFixed(0)}만원`;
  }
  return `${cost.toLocaleString()}원`;
};
