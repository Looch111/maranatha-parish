'use server';

import { revalidatePath } from 'next/cache';
// import { db } from '@/lib/firebase';
// import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { filterInappropriateContent } from '@/ai/flows/filter-inappropriate-content';

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

// Welcome Message Actions
const WelcomeSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters long.").max(200, "Message must be 200 characters or less."),
});

export async function updateWelcomeMessageAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = WelcomeSchema.safeParse({
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
      errors: { message: [contentCheck.reason || "This message was flagged as inappropriate."] },
    };
  }

  try {
    console.log('Simulating update welcome message:', validatedFields.data.message);
    revalidatePath('/');
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
       console.log('Simulating update announcement:', { id, title, content });
    } else {
       console.log('Simulating add announcement:', { title, content });
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return { type: 'success', message: `Announcement ${id ? 'updated' : 'added'} successfully!` };
  } catch (error) {
    return { type: 'error', message: 'Failed to save announcement.' };
  }
}

export async function deleteAnnouncementAction(id: string) {
    if (!id) return { type: 'error', message: 'Announcement ID is missing.' };
    try {
        console.log('Simulating delete announcement:', id);
        revalidatePath('/');
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
            console.log('Simulating update event:', { id, ...data });
        } else {
            console.log('Simulating add event:', data);
        }
        revalidatePath('/');
        revalidatePath('/admin');
        return { type: 'success', message: `Event ${id ? 'updated' : 'saved'} successfully!` };
    } catch (error) {
        return { type: 'error', message: 'Failed to save event.' };
    }
}

export async function deleteEventAction(id: string) {
    if (!id) return { type: 'error', message: 'Event ID is missing.' };
    try {
        console.log('Simulating delete event:', id);
        revalidatePath('/');
        revalidatePath('/admin');
        return { type: 'success', message: 'Event deleted.' };
    } catch (e) {
        return { type: 'error', message: 'Failed to delete event.' };
    }
}
