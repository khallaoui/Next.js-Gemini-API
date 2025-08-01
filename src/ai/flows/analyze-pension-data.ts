// src/ai/flows/analyze-pension-data.ts
'use server';

/**
 * @fileOverview An AI-powered tool that analyzes pension data to identify trends, compare pensioner data,
 * and project future pension liabilities based on historical data.
 *
 * - analyzePensionData - A function that handles the pension data analysis process.
 * - AnalyzePensionDataInput - The input type for the analyzePensionData function.
 * - AnalyzePensionDataOutput - The return type for the analyzePensionData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePensionDataInputSchema = z.object({
  pensionData: z
    .string()
    .describe(
      'Pension data in JSON format.  It should include historical records of pensioner demographics, contribution history, and payout information.'
    ),
  analysisType: z
    .string()
    .describe(
      'The type of analysis to perform. Options include: trend identification, data comparison, and liability projection.'
    ),
  reportFormat: z
    .string()
    .describe(
      'The desired format for the analysis report. Options include: text, JSON, or CSV.'
    ),
});
export type AnalyzePensionDataInput = z.infer<typeof AnalyzePensionDataInputSchema>;

const AnalyzePensionDataOutputSchema = z.object({
  report: z.string().describe('The analysis report in the specified format.'),
  summary: z.string().describe('A brief summary of the analysis results.'),
});
export type AnalyzePensionDataOutput = z.infer<typeof AnalyzePensionDataOutputSchema>;

export async function analyzePensionData(input: AnalyzePensionDataInput): Promise<AnalyzePensionDataOutput> {
  return analyzePensionDataFlow(input);
}

const analyzePensionDataPrompt = ai.definePrompt({
  name: 'analyzePensionDataPrompt',
  input: {schema: AnalyzePensionDataInputSchema},
  output: {schema: AnalyzePensionDataOutputSchema},
  prompt: `You are an expert pension data analyst. You are given pension data, the type of analysis to perform, and the desired report format.

You will analyze the pension data and generate a report in the specified format. You will also provide a brief summary of the analysis results.

Pension Data: {{{pensionData}}}
Analysis Type: {{{analysisType}}}
Report Format: {{{reportFormat}}}

Report:
Summary:`, // Ensure Handlebars syntax is used correctly
});

const analyzePensionDataFlow = ai.defineFlow(
  {
    name: 'analyzePensionDataFlow',
    inputSchema: AnalyzePensionDataInputSchema,
    outputSchema: AnalyzePensionDataOutputSchema,
  },
  async input => {
    const {output} = await analyzePensionDataPrompt(input);
    return output!;
  }
);
