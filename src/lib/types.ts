import { Timestamp } from "firebase/firestore";

export type WelcomeMessage = {
  id: string; // Should be a singleton document, e.g., 'main'
  message: string;
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
