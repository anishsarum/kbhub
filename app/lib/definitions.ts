// Shared type definitions for the application

export interface Document {
  id: string;
  title: string;
  content: string | null;
  type: string;
  createdAt: Date;
  tags: string[];
}

export interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export interface SearchResult {
  id: string;
  content: string;
  documentId: string;
  document_title: string;
  similarity_score: number;
}
