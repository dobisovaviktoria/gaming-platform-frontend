import { useState, useCallback, useMemo } from 'react';

interface UseSearchOptions<T> {
    data: T[];
    searchField: (keyof T);
}

interface UseSearchReturn<T> {
    searchQuery: string;
    searchResults: T[];
    isLoading: boolean;
    error: string | null;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
}

export const useSearch = <T extends Record<string, any>>({
                                                             data,
                                                             searchField,
                                                         }: UseSearchOptions<T>): UseSearchReturn<T> => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchResults = useMemo(() => {
        const trimmedQuery = searchQuery.trim();

        // If no search query, return all data
        if (trimmedQuery.length === 0) {
            return data;
        }

        try {
            const query = trimmedQuery.toLowerCase();

            return data.filter((item) => {
                const value = item[searchField];
                if (value == null) return false;

                return String(value).toLowerCase().includes(query)
            });
        } catch (err) {
            console.error('Search filter error:', err);
            return [];
        }
    }, [data, searchQuery, searchField]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setError(null);
        setIsLoading(false);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setError(null);
    }, []);

    return {
        searchQuery,
        searchResults,
        isLoading,
        error,
        handleSearch,
        clearSearch,
    };
};
