export function sortByTextAndId<T extends { id: number }>(
  leftLabel: string,
  rightLabel: string,
  left: T,
  right: T,
) {
  const nameComparison = leftLabel.localeCompare(rightLabel);

  if (nameComparison !== 0) {
    return nameComparison;
  }

  return left.id - right.id;
}
