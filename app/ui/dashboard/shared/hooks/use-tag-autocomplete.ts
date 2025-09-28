import { useState, useEffect } from "react";

/**
 * Custom hook for tag autocomplete functionality in search and form inputs
 * Provides keyboard navigation, filtering, and tag selection for @tag syntax
 *
 * @param query - Current input value to analyze for @tag patterns
 * @param availableTags - Array of available tag names for suggestions
 * @param onTagSelect - Callback when user selects a tag (updates parent state)
 */
export function useTagAutocomplete(
  query: string,
  availableTags: string[],
  onTagSelect?: (newQuery: string) => void
) {
  // UI state for dropdown visibility and keyboard navigation
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  // Pattern matching: detect @tag being typed at end of query
  // Matches @ followed by word chars/hyphens, positioned at start or after space
  const tagMatch = query.match(/(?:^|\s)@([\w-]*)$/);
  const isTypingTag = !!tagMatch;
  const tagQuery = isTypingTag ? tagMatch[1].toLowerCase() : "";
  const lastAtIndex = isTypingTag ? query.lastIndexOf("@") : -1;

  // Filter available tags based on current @tag input
  const suggestions =
    isTypingTag && availableTags.length > 0
      ? availableTags
          .filter((tag) => tag.toLowerCase().includes(tagQuery))
          .slice(0, 8) // Limit to 8 suggestions for performance
      : [];

  // Toggle dropdown visibility based on typing state and focus
  useEffect(() => {
    setShowSuggestions(isTypingTag && suggestions.length > 0 && isFocused);
    setSelectedIndex(-1); // Reset selection when suggestions change
  }, [query, suggestions.length, isTypingTag, isFocused]);

  // Keyboard navigation for dropdown (arrows, enter, escape)
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
    // Replace partial @tag with complete @tag + space for continued typing
    const newQuery = query.slice(0, lastAtIndex) + `@${tag} `;
    setShowSuggestions(false);
    onTagSelect?.(newQuery);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return {
    showTagSuggestions: showSuggestions,
    tagSuggestions: suggestions,
    selectedSuggestionIndex: selectedIndex,
    handleKeyDown,
    selectTag,
    handleFocus,
    handleBlur,
    updateCursorBasedSuggestions: () => {}, // Simplified - no longer needed
  };
}
