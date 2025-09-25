"use client";

import { SearchForm } from "@/app/ui/dashboard/shared/search-form";

type LibrarySearchWrapperProps = {
  children: React.ReactNode;
  onSearch: (query: string) => void;
};

export function LibrarySearchWrapper({
  children,
  onSearch,
}: LibrarySearchWrapperProps) {
  return (
    <div>
      <SearchForm
        mode="local"
        onSearch={onSearch}
        showButton={false}
        updateUrl={true}
      />
      {children}
    </div>
  );
}
