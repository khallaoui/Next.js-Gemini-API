'use server';

/**
 * @fileOverview Summarizes a pensioner's record, highlighting key information like total benefits paid,
 * notable changes in payment history, and any potential discrepancies using AI.
 *
 * @interface GenerateRecordSummaryInput - The input type for the generateRecordSummary function.
 * @interface GenerateRecordSummaryOutput - The output type for the generateRecordsummary function.
 * @function generateRecordSummary - A function that generates a summary of a pensioner's record.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecordSummaryInputSchema = z.object({
  pensionerRecord: z.string().describe("The pensioner's complete record in JSON format, including personal info, operations, and banking details."),
});

export type GenerateRecordSummaryInput = z.infer<typeof GenerateRecordSummaryInputSchema>;

const GenerateRecordSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, easy-to-understand summary of the pensioner record.'),
});

export type GenerateRecordSummaryOutput = z.infer<typeof GenerateRecordSummaryOutputSchema>;

export async function generateRecordSummary(input: GenerateRecordSummaryInput): Promise<GenerateRecordSummaryOutput> {
  return generateRecordSummaryFlow(input);
}

const generateRecordSummaryPrompt = ai.definePrompt({
  name: 'generateRecordSummaryPrompt',
  input: {schema: GenerateRecordSummaryInputSchema},
  output: {schema: GenerateRecordSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes pensioner records for a case manager.

  Given the following pensioner record:
  \`\`\`json
  {{pensionerRecord}}
  \`\`\`

  Generate a concise summary in bullet points. Highlight key information such as:
  - Total benefits paid vs. calculated net.
  - Notable changes or trends in payment history (e.g., recent debits).
  - Any potential discrepancies or points of interest (e.g., missing banking info for 'Virement' payment method).
  
  The summary should be easy to read and quickly provide actionable insights into the pensioner's financial status.`,
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
