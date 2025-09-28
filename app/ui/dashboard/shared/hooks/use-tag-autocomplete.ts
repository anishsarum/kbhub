import { useState, useEffect } from "react";

export function useTagAutocomplete(
  query: string,
  availableTags: string[],
  onTagSelect?: (newQuery: string) => void
) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Check if we're typing a tag (@ followed by word characters and hyphens, no spaces)
  const tagMatch = query.match(/(?:^|\s)@([\w-]*)$/);
  const isTypingTag = !!tagMatch;
  const tagQuery = isTypingTag ? tagMatch[1].toLowerCase() : "";
  const lastAtIndex = isTypingTag ? query.lastIndexOf("@") : -1;

  // Get filtered suggestions
  const suggestions =
    isTypingTag && availableTags.length > 0
      ? availableTags
          .filter((tag) => tag.toLowerCase().includes(tagQuery))
          .slice(0, 8) // Limit to 8 suggestions
      : [];

  // Show/hide suggestions
  useEffect(() => {
    setShowSuggestions(isTypingTag && suggestions.length > 0);
    setSelectedIndex(-1);
  }, [query, suggestions.length, isTypingTag]);

  // Simple keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return false;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return true;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return true;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectTag(suggestions[selectedIndex]);
          return true;
        }
        return false;
      case "Escape":
        setShowSuggestions(false);
        return true;
      default:
        return false;
    }
  };

  const selectTag = (tag: string) => {
    // Simple replacement - replace from last @ to end with the selected tag
    const newQuery = query.slice(0, lastAtIndex) + `@${tag} `;
    setShowSuggestions(false);
    onTagSelect?.(newQuery);
  };

  return {
    showTagSuggestions: showSuggestions,
    tagSuggestions: suggestions,
    selectedSuggestionIndex: selectedIndex,
    handleKeyDown,
    selectTag,
    updateCursorBasedSuggestions: () => {}, // Simplified - no longer needed
  };
}
