
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
  correctedReference: z.string().describe('The corrected and standardized version of the Bible verse reference.'),
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
  prompt: `You are a Bible expert. The user will provide a Bible verse reference, which may be misspelled or poorly formatted. Your tasks are:
1.  **Interpret and Correct the Reference**: Determine the correct book, chapter, and verse(s). Standardize the format (e.g., "jon 3 16" becomes "John 3:16"). Populate the 'correctedReference' field with this standardized reference.
2.  **Retrieve Verse Text**: Fetch the full text for the corrected reference from the King James Version (KJV) of the Bible.
3.  **Split the Text**: Return the text in the 'text' field, split into an array of strings based on the following rules:
    - If the reference is for a range of verses (e.g., "John 3:16-18"), each verse (16, 17, 18) must be a separate string in the array.
    - If the reference is for a single verse, split that single verse into short, meaningful phrases or sentences suitable for displaying on a screen one at a time.

Do not include the verse reference in the output text itself.

Verse Reference Provided: {{{reference}}}
`,
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
