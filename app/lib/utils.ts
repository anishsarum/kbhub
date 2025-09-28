// Shared utility functions

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncateContent(
  content: string,
  maxLength: number = 150
): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
}

