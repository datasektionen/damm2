export const groupBy = <R>(
  rows: readonly R[],
  columnKey: string
): Record<string, R[]> => {
  const groups: Record<string, R[]> = {};
  for (const row of rows) {
    const key = String((row as Record<string, unknown>)[columnKey]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  }
  return groups;
};
