'use server';

/**
 * @fileOverview A conversational AI flow that allows users to chat about pension data
 * in their application. This provides a more interactive way to explore and understand
 * the pension data beyond the structured analysis flows.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatAboutPensionsInputSchema = z.object({
  pensionData: z.string().describe("Toutes les données disponibles sur les pensions au format JSON."),
  userMessage: z.string().describe("La question ou la demande de l'utilisateur."),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe("L'historique de la conversation pour maintenir le contexte."),
});

export type ChatAboutPensionsInput = z.infer<typeof ChatAboutPensionsInputSchema>;

const ChatAboutPensionsOutputSchema = z.object({
  reply: z.string().describe("La réponse de l'IA, en français, basée sur les données fournies et le contexte de la conversation."),
  suggestedQuestions: z.array(z.string()).optional().describe("Questions suggérées que l'utilisateur pourrait poser ensuite."),
});

export type ChatAboutPensionsOutput = z.infer<typeof ChatAboutPensionsOutputSchema>;

export async function chatAboutPensions(input: ChatAboutPensionsInput): Promise<ChatAboutPensionsOutput> {
  return chatAboutPensionsFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatAboutPensionsPrompt',
  input: { schema: ChatAboutPensionsInputSchema },
  output: { schema: ChatAboutPensionsOutputSchema },
  prompt: `Vous êtes un assistant IA spécialisé dans l'analyse de données de pensions. Vous aidez les utilisateurs à comprendre et explorer leurs données de pension de manière conversationnelle.

**Données de pension disponibles :**
\`\`\`json
{{pensionData}}
\`\`\`

{{#if conversationHistory}}
**Historique de la conversation :**
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}
{{/if}}

**Question actuelle de l'utilisateur :**
"{{userMessage}}"

**Instructions :**
- Répondez en français de manière claire et conversationnelle
- Basez-vous uniquement sur les données fournies
- Si une information n'est pas disponible, indiquez-le poliment
- Utilisez des exemples concrets tirés des données quand c'est pertinent
- Maintenez le contexte de la conversation précédente
- Proposez des questions de suivi intéressantes si approprié
- Formatez votre réponse avec du markdown pour une meilleure lisibilité
- Soyez précis avec les chiffres et les statistiques

**Exemples de ce que vous pouvez faire :**
- Analyser les tendances dans les paiements
- Comparer différents pensionnaires
- Expliquer les anomalies dans les données
- Calculer des statistiques
- Identifier des patterns intéressants`,
});

const chatAboutPensionsFlow = ai.defineFlow(
  {
    name: 'chatAboutPensionsFlow',
    inputSchema: ChatAboutPensionsInputSchema,
    outputSchema: ChatAboutPensionsOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);