// Event type definition
export interface EventSpeaker {
  member?: string;         // slug of a lab member (see src/data/members.ts)
  name_zh?: string;        // external speaker: both names required
  name_en?: string;
  affiliation_zh?: string;
  affiliation_en?: string;
}

export interface Event {
  id: string;              // Unique identifier (format: type-YYYY-MM-DD)
  date: string;            // Event date (format: YYYY-MM-DD)
  year: string;            // Year as string (for grouping)
  type: string;            // Event type: "Lecture", "Conference", "Workshop", etc.
  image: string;           // Event image URL
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  speakers?: EventSpeaker[];
  location_zh?: string;    // defaults to IEAS, Academia Sinica when absent
  location_en?: string;
  abstract_zh?: string;    // optional talk abstract, shown on the event page
  abstract_en?: string;
}
