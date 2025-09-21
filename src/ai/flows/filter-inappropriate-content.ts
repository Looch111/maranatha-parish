'use server';

/**
 * @fileOverview AI-powered content filter for messages, ensuring a respectful viewing experience on the TV screen.
 *
 * - filterInappropriateContent - A function that filters the content.
 * - FilterInappropriateContentInput - The input type for the filterInappropriateContent function.
 * - FilterInappropriateContentOutput - The return type for the filterInappropriateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterInappropriateContentInputSchema = z.object({
  message: z
    .string()
    .describe('The message to be checked for inappropriate content.'),
  parishGuidelines: z
    .string()
    .describe('The guidelines of the parish for content appropriateness.'),
});
export type FilterInappropriateContentInput = z.infer<
  typeof FilterInappropriateContentInputSchema
>;

const FilterInappropriateContentOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe(
      'A boolean value indicating whether the message is appropriate based on the parish guidelines.'
    ),
  reason: z
    .string()
    .optional()
    .describe(
      'The reason why the message is considered inappropriate, if applicable.'
    ),
    correctedMessage: z.string().describe('The corrected version of the message, with any spelling or grammatical errors fixed.'),
});
export type FilterInappropriateContentOutput = z.infer<
  typeof FilterInappropriateContentOutputSchema
>;

export async function filterInappropriateContent(
  input: FilterInappropriateContentInput
): Promise<FilterInappropriateContentOutput> {
  return filterInappropriateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterInappropriateContentPrompt',
  input: {schema: FilterInappropriateContentInputSchema},
  output: {schema: FilterInappropriateContentOutputSchema},
  prompt: `You are an AI content filter and proofreader that checks if a message is appropriate and grammatically correct based on the parish guidelines.

Parish Guidelines: {{{parishGuidelines}}}

Message: {{{message}}}

1.  **Check for Appropriateness**: Based on the parish guidelines, determine if the message is appropriate. If it is not, explain why. Set the isAppropriate field to true if appropriate, and false if not. If isAppropriate is false, also populate the reason field.
2.  **Correct Spelling and Grammar**: Review the message for any spelling or grammar errors.
3.  **Return Corrected Message**: Populate the 'correctedMessage' field with the proofread and corrected version of the message. If no corrections are needed, return the original message. If the message is inappropriate, you should still return a corrected version of the original text.`,
});

const filterInappropriateContentFlow = ai.defineFlow(
  {
    name: 'filterInappropriateContentFlow',
    inputSchema: FilterInappropriateContentInputSchema,
    outputSchema: FilterInappropriateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
