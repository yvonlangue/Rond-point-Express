'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quick filter suggestions based on user preferences.
 *
 * generateQuickFilters - A function that generates quick filter suggestions.
 * GenerateQuickFiltersInput - The input type for the generateQuickFilters function.
 * GenerateQuickFiltersOutput - The return type for the generateQuickFilters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuickFiltersInputSchema = z.object({
  userHistory: z
    .string()
    .describe(
      'A summary of the user history, including past interactions and preferences related to events.'
    ),
});
export type GenerateQuickFiltersInput = z.infer<typeof GenerateQuickFiltersInputSchema>;

const GenerateQuickFiltersOutputSchema = z.object({
  suggestedFilters: z
    .array(z.string())
    .describe('An array of suggested event categories or tags based on user history.'),
});
export type GenerateQuickFiltersOutput = z.infer<typeof GenerateQuickFiltersOutputSchema>;

export async function generateQuickFilters(
  input: GenerateQuickFiltersInput
): Promise<GenerateQuickFiltersOutput> {
  return generateQuickFiltersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuickFiltersPrompt',
  input: {schema: GenerateQuickFiltersInputSchema},
  output: {schema: GenerateQuickFiltersOutputSchema},
  prompt: `Based on the following user history and preferences: {{{userHistory}}}, suggest 5 relevant event categories or tags that the user might be interested in. Return them as an array of strings.`,
});

const generateQuickFiltersFlow = ai.defineFlow(
  {
    name: 'generateQuickFiltersFlow',
    inputSchema: GenerateQuickFiltersInputSchema,
    outputSchema: GenerateQuickFiltersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
