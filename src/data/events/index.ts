/**
 * Events Index
 *
 * This file automatically imports all event files and exports them as an array.
 *
 * TO ADD A NEW EVENT:
 * 1. Copy _template.ts and rename it (e.g., lecture-2025-12-20.ts)
 * 2. Fill in the event details
 * 3. Import and add it to the events array below
 * 4. Events are automatically sorted by date (newest first)
 */

import { Event } from './types';

// Import all events
import lecture20251209 from './lecture-2025-12-09';
import lecture20251008 from './lecture-2025-10-08';
import conf20250703 from './conf-2025-07-03';

// Export all events as an array
const allEvents: Event[] = [
  lecture20251209,
  lecture20251008,
  conf20250703,
  // Add new events here (they will be automatically sorted by date)
];

// Sort events by date (newest first)
export const POSTS = allEvents.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Also export the Event type for convenience
export type { Event };
