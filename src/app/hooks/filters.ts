import { useEffect, useState } from 'react';
import { Filters } from '../utils/types';

export function useFilters(): [
  filters: Filters,
  setFilters: (filters: Filters) => void,
] {
  const [searchFilters, setSearchFilters] = useState<Filters>({
    rootModules: [],
    leafModules: [],
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (
      searchParams.get('roots') !== searchFilters.rootModules.join(',') ||
      searchParams.get('leaves') !== searchFilters.leafModules.join(',')
    ) {
      setSearchFilters({
        rootModules: searchParams.get('roots')?.split(',') ?? [],
        leafModules: searchParams.get('leaves')?.split(',') ?? [],
      });
    }
  }, []);

  const updateSearch = (filters: Filters) => {
    const searchParams = new URLSearchParams();
    if (filters.rootModules.length > 0) {
      searchParams.append('roots', filters.rootModules.join(','));
    }
    if (filters.leafModules.length > 0) {
      searchParams.append('leaves', filters.leafModules.join(','));
    }
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    setSearchFilters(filters);
  };

  return [searchFilters, updateSearch];
}
