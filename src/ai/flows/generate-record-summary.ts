'use server';

/**
 * @fileOverview Summarizes a pensioner's record, highlighting key information like total benefits paid,
 * notable changes in payment history, and any potential discrepancies using AI.
 *
 * @interface GenerateRecordSummaryInput - The input type for the generateRecordSummary function.
 * @interface GenerateRecordSummaryOutput - The output type for the generateRecordSummary function.
 * @function generateRecordSummary - A function that generates a summary of a pensioner's record.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecordSummaryInputSchema = z.object({
  pensionerRecord: z.string().describe('The complete record of the pensioner.'),
});

export type GenerateRecordSummaryInput = z.infer<typeof GenerateRecordSummaryInputSchema>;

const GenerateRecordSummaryOutputSchema = z.object({
  summary: z.string().describe('A summarized version of the pensioner record.'),
});

export type GenerateRecordSummaryOutput = z.infer<typeof GenerateRecordSummaryOutputSchema>;

export async function generateRecordSummary(input: GenerateRecordSummaryInput): Promise<GenerateRecordSummaryOutput> {
  return generateRecordSummaryFlow(input);
}

const generateRecordSummaryPrompt = ai.definePrompt({
  name: 'generateRecordSummaryPrompt',
  input: {schema: GenerateRecordSummaryInputSchema},
  output: {schema: GenerateRecordSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes pensioner records.

  Given the following pensioner record:
  {{pensionerRecord}}

  Generate a concise summary highlighting key information such as total benefits paid, notable changes in payment history, and any potential discrepancies.
  The summary should be easy to understand and should quickly provide insights into the pensioner's financial status.`,
});

const generateRecordSummaryFlow = ai.defineFlow(
  {
    name: 'generateRecordSummaryFlow',
    inputSchema: GenerateRecordSummaryInputSchema,
    outputSchema: GenerateRecordSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateRecordSummaryPrompt(input);
    return output!;
  }
);
