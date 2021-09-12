import { useState, useMemo } from 'react';

// Hook for sorting tables.
// https://www.smashingmagazine.com/2020/03/sortable-tables-react/
const useSortableData = (items: any[], config: {key: string; direction: string}) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sorted = useMemo(() => {
        return [...items].sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            else if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        })
    }, [items, sortConfig]);

    const requestSort = (key: string) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
        setSortConfig({ key, direction });
    };

    return { items: sorted, requestSort, sortConfig };
}

export default useSortableData;