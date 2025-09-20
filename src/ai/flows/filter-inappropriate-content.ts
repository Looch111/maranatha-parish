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
  prompt: `You are an AI content filter that checks if a message is appropriate based on the parish guidelines.

Parish Guidelines: {{{parishGuidelines}}}

Message: {{{message}}}

Based on the parish guidelines, determine if the message is appropriate. If it is not, explain why.
Set the isAppropriate field to true if appropriate, and false if not. If isAppropriate is false, also populate the reason field.`,
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
