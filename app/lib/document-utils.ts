import { Document } from "./definitions";

/**
 * Simple document filtering utility for demo purposes
 * Supports both text search and @tag filtering
 */
export function filterDocuments(
  documents: Document[],
  query: string
): Document[] {
  if (!query.trim()) return documents;

  const searchTerm = query.toLowerCase().trim();

  // Extract @tag mentions from the query
  const tagMatches = searchTerm.match(/@\w+/g) || [];
  const tagQueries = tagMatches.map((tag) => tag.slice(1)); // Remove @ symbols

  // Get remaining text after removing @tag mentions
  const textQuery = searchTerm.replace(/@\w+/g, "").trim();

  return documents.filter((doc) => {
    let matches = true;

    // Check tag matches if any @tag queries exist
    if (tagQueries.length > 0) {
      const tagMatches = tagQueries.every((tagQuery) =>
        doc.tags.some((tag) => tag.toLowerCase().includes(tagQuery))
      );
      matches = matches && tagMatches;
    }

    // Check text matches if text query exists
    if (textQuery) {
      const titleMatch = doc.title.toLowerCase().includes(textQuery);
      const contentMatch =
        doc.content?.toLowerCase().includes(textQuery) ?? false;
      const tagMatch = doc.tags.some((tag) =>
        tag.toLowerCase().includes(textQuery)
      );
      const typeMatch = doc.type.toLowerCase().includes(textQuery);

      const textMatches = titleMatch || contentMatch || tagMatch || typeMatch;
      matches = matches && textMatches;
    }

    return matches;
  });
}
