import { useState, useEffect, useCallback } from "react";

interface UseDataFetchOptions<T> {
    fetchFn: () => Promise<T>;
    dependencies?: any[];
    initialData?: T;
    skip?: boolean;
}

interface UseDataFetchResult<T> {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useDataFetch<T>({
    fetchFn,
    dependencies = [],
    initialData,
    skip = false
}: UseDataFetchOptions<T>): UseDataFetchResult<T> {
    const [data, setData] = useState<T>(initialData as T);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (skip) return;

        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            console.error("Data fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [fetchFn, skip]);

    useEffect(() => {
        fetchData();
    }, [...dependencies, fetchData]);

    return { data, loading, error, refetch: fetchData };
}
