/**
 * EVENT TEMPLATE
 *
 * Copy this file and rename it to match your event ID
 * Example: lecture-2025-12-20.ts
 *
 * Then fill in the details below and save.
 * The event will automatically appear on the website!
 */

import { Event } from './types';

export const event: Event = {
  // REQUIRED: Unique ID (format: type-YYYY-MM-DD)
  // Examples: "lecture-2025-12-20", "conference-2025-11-15", "workshop-2025-10-08"
  id: "TYPE-YYYY-MM-DD",

  // REQUIRED: Event date (format: YYYY-MM-DD)
  date: "YYYY-MM-DD",

  // REQUIRED: Year as string (used for grouping events)
  year: "YYYY",

  // REQUIRED: Event type
  // Common types: "Lecture", "Conference", "Workshop", "Seminar", "Symposium", "Talk"
  type: "TYPE",

  // REQUIRED: Event image URL (16:10 or 16:9 aspect ratio recommended)
  // Free images: https://unsplash.com/ (add ?auto=format&fit=crop&q=80&w=800)
  image: "https://images.unsplash.com/photo-XXXXXXX?auto=format&fit=crop&q=80&w=800",

  // REQUIRED: Chinese title
  title_zh: "活動標題",

  // REQUIRED: English title
  title_en: "Event Title",

  // REQUIRED: Chinese description
  // Keep it concise (2-4 sentences)
  // Include: speaker, topic, key points
  content_zh: "活動內容描述...",

  // REQUIRED: English description
  // Match Chinese content but adapt for English readers
  content_en: "Event description...",
};

export default event;
