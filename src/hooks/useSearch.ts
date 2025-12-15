import { useState } from 'react';

interface UseSearchOptions<T> {
    data: T[];
    searchField: keyof T;
}

interface UseSearchReturn<T> {
    searchQuery: string;
    searchResults: T[];
    isLoading: boolean;
    error: string | null;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
}

export function useSearch<T extends Record<string, any>>(
    { data, searchField }: UseSearchOptions<T>
): UseSearchReturn<T> {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Derived each render, no memo
    const trimmedQuery = searchQuery.trim();
    let searchResults: T[];

    if (!trimmedQuery) {
        searchResults = data;
    } else {
        const q = trimmedQuery.toLowerCase();
        searchResults = data.filter((item) => {
            const value = item[searchField];
            if (value == null) return false;
            return String(value).toLowerCase().includes(q);
        });
    }

    // Plain functions; identity changes each render, but that’s fine
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setError(null);
        setIsLoading(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setError(null);
    };

    return {
        searchQuery,
        searchResults,
        isLoading,
        error,
        handleSearch,
        clearSearch,
    };
}
