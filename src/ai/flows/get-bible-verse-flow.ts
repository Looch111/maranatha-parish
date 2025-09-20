
'use server';
/**
 * @fileOverview An AI flow to retrieve the text of a Bible verse from its reference.
 *
 * - getBibleVerseText - A function that fetches the Bible verse text.
 * - GetBibleVerseTextInput - The input type for the getBibleVerseText function.
 * - GetBibleVerseTextOutput - The return type for the getBibleVerseText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetBibleVerseTextInputSchema = z.object({
  reference: z
    .string()
    .describe('The Bible verse reference, e.g., "John 3:16".'),
});
export type GetBibleVerseTextInput = z.infer<
  typeof GetBibleVerseTextInputSchema
>;

const GetBibleVerseTextOutputSchema = z.object({
  text: z.array(z.string()).describe('The full text of the Bible verse, split into meaningful chunks for display.'),
});
export type GetBibleVerseTextOutput = z.infer<
  typeof GetBibleVerseTextOutputSchema
>;

export async function getBibleVerseText(
  input: GetBibleVerseTextInput
): Promise<GetBibleVerseTextOutput> {
  return getBibleVerseTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getBibleVerseTextPrompt',
  input: {schema: GetBibleVerseTextInputSchema},
  output: {schema: GetBibleVerseTextOutputSchema},
  prompt: `You are a Bible expert. The user will provide a Bible verse reference. Your task is to return the full text of that verse or range of verses.

Verse Reference: {{{reference}}}

Return the text split into an array of strings.
- If the reference is for a range of verses (e.g., "John 3:16-18"), each verse (16, 17, 18) must be a separate string in the array.
- If the reference is for a single verse, split that single verse into short, meaningful phrases or sentences suitable for displaying on a screen one at a time.

Do not include the verse reference in the output text.`,
});

const getBibleVerseTextFlow = ai.defineFlow(
  {
    name: 'getBibleVerseTextFlow',
    inputSchema: GetBibleVerseTextInputSchema,
    outputSchema: GetBibleVerseTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
