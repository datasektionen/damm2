import { useState, useMemo } from 'react';

// Hook for sorting tables.
// https://www.smashingmagazine.com/2020/03/sortable-tables-react/
const useSortableData = <T>(
  items: T[],
  config: { key: string; direction: string }
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sorted = useMemo(() => {
    const key = sortConfig.key as keyof T;
    return [...items].sort((a, b) => {
      if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
      else if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  return { items: sorted, requestSort, sortConfig };
};

export default useSortableData;
