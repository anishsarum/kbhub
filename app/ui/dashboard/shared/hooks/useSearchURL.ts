import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function useSearchURL(updateUrl: boolean = false) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get initial query from URL
  const getInitialQuery = (): string => {
    if (updateUrl && searchParams.get("q")) {
      return searchParams.get("q") || "";
    }
    return "";
  };

  // Debounced URL update function
  const debouncedUrlUpdate = useDebouncedCallback((term: string) => {
    if (!updateUrl) return;

    const params = new URLSearchParams(searchParams);
    if (term.trim()) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const updateURL = (query: string) => {
    if (updateUrl) {
      debouncedUrlUpdate(query);
    }
  };

  return {
    getInitialQuery,
    updateURL,
    currentQuery: searchParams.get("q") || "",
  };
}
