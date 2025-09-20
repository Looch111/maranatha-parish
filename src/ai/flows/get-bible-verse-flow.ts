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
  text: z.string().describe('The full text of the Bible verse.'),
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

Return only the text of the verse.`,
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
