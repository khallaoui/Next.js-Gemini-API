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
  pensionerRecord: z.string().describe("Le dossier complet du pensionnaire au format JSON, incluant les informations personnelles, les opérations et les détails bancaires."),
});

export type GenerateRecordSummaryInput = z.infer<typeof GenerateRecordSummaryInputSchema>;

const GenerateRecordSummaryOutputSchema = z.object({
  summary: z.string().describe('Un résumé concis et facile à comprendre du dossier du pensionnaire au format markdown.'),
});

export type GenerateRecordSummaryOutput = z.infer<typeof GenerateRecordSummaryOutputSchema>;

export async function generateRecordSummary(input: GenerateRecordSummaryInput): Promise<GenerateRecordSummaryOutput> {
  return generateRecordSummaryFlow(input);
}

const generateRecordSummaryPrompt = ai.definePrompt({
  name: 'generateRecordSummaryPrompt',
  input: {schema: GenerateRecordSummaryInputSchema},
  output: {schema: GenerateRecordSummaryOutputSchema},
  prompt: `Vous êtes un assistant IA qui résume les dossiers des pensionnaires pour un gestionnaire de cas. La réponse DOIT être en français.

  Étant donné le dossier du pensionnaire suivant :
  \`\`\`json
  {{pensionerRecord}}
  \`\`\`

  Générez un résumé concis sous forme de liste à puces en markdown. Mettez en évidence les informations clés telles que :
  - Le total des prestations versées par rapport au net calculé.
  - Les changements ou tendances notables dans l'historique des paiements (par exemple, les débits récents).
  - Toute anomalie potentielle ou point d'intérêt (par exemple, des informations bancaires manquantes pour le mode de paiement 'Virement').
  
  Le résumé doit être facile à lire et fournir rapidement des informations exploitables sur la situation financière du pensionnaire. Assurez-vous que la sortie est un markdown valide.`,
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
