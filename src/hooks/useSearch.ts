import {useState} from 'react';

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

export function useSearch<T extends object>({data, searchField,}: UseSearchOptions<T>): UseSearchReturn<T> {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading] = useState(false);
    const [error] = useState<string | null>(null);

    const trimmedQuery = searchQuery.trim().toLowerCase();

    const searchResults = !trimmedQuery
        ? data
        : data.filter((item) => {
            const value = item[searchField];
            if (value == null) return false;
            return String(value).toLowerCase().includes(trimmedQuery);
        });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
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