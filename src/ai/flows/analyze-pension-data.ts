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
      'Données de pension au format JSON. Elles doivent inclure les dossiers historiques sur les données démographiques des pensionnés, l’historique des cotisations et les informations sur les paiements.'
    ),
  analysisType: z
    .string()
    .describe(
      "Le type d'analyse à effectuer. Options : identification des tendances, comparaison des données et projection des engagements."
    ),
  reportFormat: z
    .string()
    .describe(
      'Le format souhaité pour le rapport d’analyse. Options : texte, JSON ou CSV.'
    ),
});
export type AnalyzePensionDataInput = z.infer<typeof AnalyzePensionDataInputSchema>;

const AnalyzePensionDataOutputSchema = z.object({
  report: z.string().describe('Le rapport d’analyse dans le format spécifié. Il doit s’agir d’une sortie détaillée et structurée.'),
  summary: z.string().describe('Un résumé bref et perspicace des principales conclusions de l’analyse.'),
});
export type AnalyzePensionDataOutput = z.infer<typeof AnalyzePensionDataOutputSchema>;

export async function analyzePensionData(input: AnalyzePensionDataInput): Promise<AnalyzePensionDataOutput> {
  return analyzePensionDataFlow(input);
}

const analyzePensionDataPrompt = ai.definePrompt({
  name: 'analyzePensionDataPrompt',
  input: {schema: AnalyzePensionDataInputSchema},
  output: {schema: AnalyzePensionDataOutputSchema},
  prompt: `Vous êtes un analyste expert en données de pension. Votre tâche est d'analyser les données de pension fournies en fonction du type d'analyse demandé et de générer un rapport dans le format spécifié. La réponse DOIT être en français.

Vous devez fournir un rapport détaillé et bien structuré ainsi qu'un résumé concis et perspicace de vos conclusions.

**Données de Pension :**
\`\`\`json
{{{pensionData}}}
\`\`\`

**Type d'Analyse :** {{{analysisType}}}
**Format du Rapport :** {{{reportFormat}}}

Commencez l'analyse maintenant. Structurez clairement votre réponse.`,
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
