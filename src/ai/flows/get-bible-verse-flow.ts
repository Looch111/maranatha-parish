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
  prompt: `You are a Bible expert. The user will provide a Bible verse reference. Your task is to return the full text of that verse.

Verse Reference: {{{reference}}}

Return the text split into an array of strings. Each string in the array should be a short, meaningful phrase or sentence suitable for displaying on a screen one at a time. Do not include the verse reference in the output text.`,
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
