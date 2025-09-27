import { useEffect } from "react";

export function useDebouncedSearch(
  query: string,
  onSearch?: (query: string) => void,
  enabled: boolean = true,
  delay: number = 300
) {
  useEffect(() => {
    if (!enabled || !onSearch) return;

    const timer = setTimeout(() => {
      onSearch(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, onSearch, enabled, delay]);

  const triggerImmediateSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return {
    triggerImmediateSearch,
  };
}
