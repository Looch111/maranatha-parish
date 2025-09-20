import { Timestamp } from 'firebase/firestore';

export type WelcomeMessage = {
  id: string; // Should be a singleton document, e.g., 'main'
  message: string;
  subtitle?: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
};

export type Event = {
  id: string;
  name: string;
  date: string; // Store as ISO string YYYY-MM-DD
  time: string; // Store as HH:mm
  location: string;
};

export type Hymn = {
  id: string;
  title: string;
  lyrics: string[];
};

export type BibleVerse = {
  id: string;
  reference: string;
  text: string;
};

export type WhatsNext = {
  id:string;
  message: string;
};

export type DisplayItem = 
    | { type: 'welcome', data: WelcomeMessage }
    | { type: 'announcements', data: Announcement[] }
    | { type: 'events', data: Event[] }
    | { type: 'hymn', data: Hymn }
    | { type: 'bible-verse', data: BibleVerse }
    | { type: 'whats-next', data: WhatsNext };

export type LiveDisplayItem = (DisplayItem | { type: 'none', data: null }) & {
    timestamp: Timestamp;
    currentVerseIndex?: number;
};
