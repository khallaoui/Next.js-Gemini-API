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
      'Pension data in JSON format. It should include historical records of pensioner demographics, contribution history, and payout information.'
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
  report: z.string().describe('The analysis report in the specified format. This should be a detailed, structured output.'),
  summary: z.string().describe('A brief, insightful summary of the key findings from the analysis.'),
});
export type AnalyzePensionDataOutput = z.infer<typeof AnalyzePensionDataOutputSchema>;

export async function analyzePensionData(input: AnalyzePensionDataInput): Promise<AnalyzePensionDataOutput> {
  return analyzePensionDataFlow(input);
}

const analyzePensionDataPrompt = ai.definePrompt({
  name: 'analyzePensionDataPrompt',
  input: {schema: AnalyzePensionDataInputSchema},
  output: {schema: AnalyzePensionDataOutputSchema},
  prompt: `You are an expert pension data analyst. Your task is to analyze the provided pension data based on the requested analysis type and generate a report in the specified format.

You must provide a detailed, well-structured report and a concise summary of your findings.

**Pension Data:**
\`\`\`json
{{{pensionData}}}
\`\`\`

**Analysis Type:** {{{analysisType}}}
**Report Format:** {{{reportFormat}}}

Begin the analysis now.`,
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
