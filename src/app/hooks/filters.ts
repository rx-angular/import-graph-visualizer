import { useEffect, useState } from 'react';
import { Filters } from '../utils/types';

export function useFilters(): [
  filters: Filters,
  setFilters: (filters: Filters) => void,
] {
  const [searchFilters, setSearchFilters] = useState<Filters>({
    targetModules: [],
    sourceModules: [],
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (
      searchParams.get('tgt') !== searchFilters.targetModules.join(',') ||
      searchParams.get('src') !== searchFilters.sourceModules.join(',')
    ) {
      setSearchFilters({
        targetModules: searchParams.get('tgt')?.split(',') ?? [],
        sourceModules: searchParams.get('src')?.split(',') ?? [],
      });
    }
  }, []);

  const updateSearch = (filters: Filters) => {
    const searchParams = new URLSearchParams();
    if (filters.targetModules.length > 0) {
      searchParams.append('tgt', filters.targetModules.join(','));
    }
    if (filters.sourceModules.length > 0) {
      searchParams.append('src', filters.sourceModules.join(','));
    }
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    setSearchFilters(filters);
  };

  return [searchFilters, updateSearch];
}
