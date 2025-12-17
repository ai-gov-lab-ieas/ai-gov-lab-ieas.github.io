// Event type definition
export interface Event {
  id: string;           // Unique identifier (format: type-YYYY-MM-DD)
  date: string;         // Event date (format: YYYY-MM-DD)
  year: string;         // Year as string (for grouping)
  type: string;         // Event type: "Lecture", "Conference", "Workshop", etc.
  image: string;        // Event image URL
  title_zh: string;     // Chinese title
  title_en: string;     // English title
  content_zh: string;   // Chinese description
  content_en: string;   // English description
}
