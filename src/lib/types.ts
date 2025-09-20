
export type WelcomeMessage = {
  id: string; // Should be a singleton document, e.g., 'main'
  message: string;
  subtitle?: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Using string for mock data
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
  id: string;
  message: string;
};
