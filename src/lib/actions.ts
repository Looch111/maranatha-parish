'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { filterInappropriateContent } from '@/ai/flows/filter-inappropriate-content';
import type { DisplayItem } from '@/lib/types';

type FormState = {
  type: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Record<string, string[]>;
};

const parishGuidelines = "Content must be family-friendly, respectful, and relevant to church activities. No profanity, hate speech, or political content is allowed. Keep messages positive and welcoming.";

const checkContent = async (message: string) => {
    try {
        const result = await filterInappropriateContent({
            message,
            parishGuidelines,
        });
        return result;
    } catch (error) {
        console.error("AI content filter failed:", error);
        // Fail open: if the filter fails, assume the content is appropriate to not block users.
        return { isAppropriate: true };
    }
};

// Live Display Actions
export async function setLiveDisplayAction(item: DisplayItem, currentVerseIndex?: number) {
    try {
        const liveDisplayRef = doc(db, 'live', 'current');
        const dataToSet: any = {
            type: item.type,
            data: item.data,
            timestamp: serverTimestamp()
        };
        if (item.type === 'hymn' && currentVerseIndex !== undefined) {
            dataToSet.currentVerseIndex = currentVerseIndex;
        }
        await setDoc(liveDisplayRef, dataToSet);
        revalidatePath('/');
        return { type: 'success', message: `Displaying "${item.type}" now.` };
    } catch (error) {
        console.error("Error setting live display:", error);
        return { type: 'error', message: 'Failed to update live display.' };
    }
}

export async function stopLiveDisplayAction() {
    try {
        const liveDisplayRef = doc(db, 'live', 'current');
        await setDoc(liveDisplayRef, { type: 'none', timestamp: serverTimestamp() });
        revalidatePath('/');
        return { type: 'success', message: 'Live display stopped.' };
    } catch (error) {
        console.error("Error stopping live display:", error);
        return { type: 'error', message: 'Failed to stop live display.' };
    }
}


// Welcome Message Actions
const WelcomeSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters long.").max(200, "Message must be 200 characters or less."),
  subtitle: z.string().max(100, "Subtitle must be 100 characters or less.").optional(),
});

export async function updateWelcomeMessageAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = WelcomeSchema.safeParse({
    message: formData.get('message'),
    subtitle: formData.get('subtitle'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const fullMessage = `${validatedFields.data.message} ${validatedFields.data.subtitle || ''}`;
  const contentCheck = await checkContent(fullMessage);
  if (!contentCheck.isAppropriate) {
    return {
      type: 'error',
      message: contentCheck.reason || "This message was flagged as inappropriate."
    };
  }

  try {
    const welcomeRef = doc(db, 'content', 'welcome');
    await setDoc(welcomeRef, validatedFields.data, { merge: true });
    revalidatePath('/admin');
    return { type: 'success', message: 'Welcome message updated successfully!' };
  } catch (error) {
    return { type: 'error', message: 'Failed to update welcome message.' };
  }
}

// Announcement Actions
const AnnouncementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is too short.").max(100, "Title is too long."),
  content: z.string().min(10, "Content is too short.").max(500, "Content is too long."),
});

export async function saveAnnouncementAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = AnnouncementSchema.safeParse({
    id: formData.get('id') as string || undefined,
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return { type: 'error', errors: validatedFields.error.flatten().fieldErrors };
  }

  const { id, title, content } = validatedFields.data;
  
  const contentCheck = await checkContent(`${title}: ${content}`);
  if (!contentCheck.isAppropriate) {
    return { type: 'error', errors: { content: [contentCheck.reason || "This announcement was flagged as inappropriate."] }};
  }

  try {
    if (id) {
       const announcementRef = doc(db, 'announcements', id);
       await updateDoc(announcementRef, { title, content });
    } else {
       const announcementCollection = collection(db, 'announcements');
       await addDoc(announcementCollection, { title, content, createdAt: serverTimestamp() });
    }
    revalidatePath('/admin');
    return { type: 'success', message: `Announcement ${id ? 'updated' : 'added'} successfully!` };
  } catch (error) {
    return { type: 'error', message: 'Failed to save announcement.' };
  }
}

export async function deleteAnnouncementAction(id: string) {
    if (!id) return { type: 'error', message: 'Announcement ID is missing.' };
    try {
        const announcementRef = doc(db, 'announcements', id);
        await deleteDoc(announcementRef);
        revalidatePath('/admin');
        return { type: 'success', message: 'Announcement deleted.' };
    } catch (e) {
        return { type: 'error', message: 'Failed to delete announcement.' };
    }
}


// Event Actions
const EventSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Event name is too short.").max(100, "Event name is too long."),
    date: z.string().min(1, "Date is required."),
    time: z.string().min(1, "Time is required."),
    location: z.string().min(3, "Location is too short.").max(100, "Location is too long."),
});


export async function saveEventAction(prevState: any, formData: FormData): Promise<FormState> {
    const validatedFields = EventSchema.safeParse({
        id: formData.get('id') as string || undefined,
        name: formData.get('name'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return { type: 'error', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, ...data } = validatedFields.data;

    try {
        if (id) {
            const eventRef = doc(db, 'events', id);
            await updateDoc(eventRef, data);
        } else {
            const eventCollection = collection(db, 'events');
            await addDoc(eventCollection, data);
        }
        revalidatePath('/admin');
        return { type: 'success', message: `Event ${id ? 'updated' : 'saved'} successfully!` };
    } catch (error) {
        return { type: 'error', message: 'Failed to save event.' };
    }
}

export async function deleteEventAction(id: string) {
    if (!id) return { type: 'error', message: 'Event ID is missing.' };
    try {
        const eventRef = doc(db, 'events', id);
        await deleteDoc(eventRef);
        revalidatePath('/admin');
        return { type: 'success', message: 'Event deleted.' };
    } catch (e) {
        return { type: 'error', message: 'Failed to delete event.' };
    }
}

// Hymn Actions
const HymnSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, "Title is too short.").max(150, "Title is too long."),
    lyrics: z.array(z.string().min(1, "Verse cannot be empty.")).min(1, "At least one verse is required."),
});

export async function saveHymnAction(prevState: FormState, formData: FormData): Promise<FormState> {
    
    const lyrics = Array.from(formData.keys())
      .filter(key => key.startsWith('lyrics['))
      .map(key => formData.get(key) as string);

    const validatedFields = HymnSchema.safeParse({
        id: formData.get('id') as string || undefined,
        title: formData.get('title'),
        lyrics: lyrics,
    });

    if (!validatedFields.success) {
        return { type: 'error', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, title, lyrics: validatedLyrics } = validatedFields.data;
    
    const contentCheck = await checkContent(`${title}: ${validatedLyrics.join('\n')}`);
    if (!contentCheck.isAppropriate) {
        return { type: 'error', errors: { lyrics: [contentCheck.reason || "This hymn was flagged as inappropriate."] }};
    }

    try {
        if (id) {
            const hymnRef = doc(db, 'hymns', id);
            await updateDoc(hymnRef, { title, lyrics: validatedLyrics });
        } else {
            const hymnCollection = collection(db, 'hymns');
            await addDoc(hymnCollection, { title, lyrics: validatedLyrics });
        }
        revalidatePath('/admin');
        return { type: 'success', message: `Hymn ${id ? 'updated' : 'added'} successfully!` };
    } catch (error) {
        return { type: 'error', message: 'Failed to save hymn.' };
    }
}

export async function deleteHymnAction(id: string) {
    if (!id) return { type: 'error', message: 'Hymn ID is missing.' };
    try {
        const hymnRef = doc(db, 'hymns', id);
        await deleteDoc(hymnRef);
        revalidatePath('/admin');
        return { type: 'success', message: 'Hymn deleted.' };
    } catch (e) {
        return { type: 'error', message: 'Failed to delete hymn.' };
    }
}


// Bible Verse Actions
const BibleVerseSchema = z.object({
    id: z.string().optional(),
    reference: z.string().min(3, "Reference is too short.").max(100, "Reference is too long."),
    text: z.string().min(10, "Text is too short.").max(1000, "Text is too long."),
});

export async function saveBibleVerseAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = BibleVerseSchema.safeParse({
        id: formData.get('id') as string || undefined,
        reference: formData.get('reference'),
        text: formData.get('text'),
    });

    if (!validatedFields.success) {
        return { type: 'error', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, reference, text } = validatedFields.data;
    
    const contentCheck = await checkContent(`${reference}: ${text}`);
    if (!contentCheck.isAppropriate) {
        return { type: 'error', errors: { text: [contentCheck.reason || "This Bible verse was flagged as inappropriate."] }};
    }

    try {
        if (id) {
            const verseRef = doc(db, 'bible-verses', id);
            await updateDoc(verseRef, { reference, text });
        } else {
            const verseCollection = collection(db, 'bible-verses');
            await addDoc(verseCollection, { reference, text });
        }
        revalidatePath('/admin');
        return { type: 'success', message: `Bible verse ${id ? 'updated' : 'added'} successfully!` };
    } catch (error) {
        return { type: 'error', message: 'Failed to save Bible verse.' };
    }
}

export async function deleteBibleVerseAction(id: string) {
    if (!id) return { type: 'error', message: 'Bible verse ID is missing.' };
    try {
        const verseRef = doc(db, 'bible-verses', id);
        await deleteDoc(verseRef);
        revalidatePath('/admin');
        return { type: 'success', message: 'Bible verse deleted.' };
    } catch (e) {
        return { type: 'error', message: 'Failed to delete Bible verse.' };
    }
}

// What's Next Actions
const WhatsNextSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters long.").max(200, "Message must be 200 characters or less."),
});

export async function updateWhatsNextAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = WhatsNextSchema.safeParse({
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const contentCheck = await checkContent(validatedFields.data.message);
  if (!contentCheck.isAppropriate) {
    return {
      type: 'error',
      message: contentCheck.reason || "This message was flagged as inappropriate."
    };
  }

  try {
    const whatsNextRef = doc(db, 'content', 'whats-next');
    await setDoc(whatsNextRef, validatedFields.data, { merge: true });
    revalidatePath('/admin');
    return { type: 'success', message: 'What\'s next message updated successfully!' };
  } catch (error) {
    return { type: 'error', message: 'Failed to update message.' };
  }
}
