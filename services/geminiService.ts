import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini
const getAI = () => {
    try {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (e) {
        console.error("API Key missing");
        return null;
    }
}

export const generateNewsContent = async (prompt: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return "AI configuratie ontbreekt.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Je bent een assistent voor de directie van VBS Sint-Maarten in Sijsele. Schrijf een kort, warm en professioneel nieuwsbericht voor de website (max 120 woorden) gebaseerd op: "${prompt}". Gebruik paragrafen.`,
    });
    
    return response.text || "Kon geen tekst genereren.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Er is een fout opgetreden bij het verbinden met de AI assistent.";
  }
};

export const generateChatResponse = async (history: ChatMessage[], userMessage: string): Promise<string> => {
    const ai = getAI();
    if (!ai) return "Excuses, ik ben even niet bereikbaar.";

    try {
        // Create a simple context for the bot
        const systemPrompt = `
            Je bent de behulpzame virtuele medewerker van VBS Sint-Maarten in Sijsele (Brugge).
            Je spreekt ouders aan met 'u'. Je bent vriendelijk, kort en bondig.
            
            Belangrijke info:
            - Adres: Kloosterstraat 1, 8340 Sijsele.
            - Telefoon: 050 12 34 56.
            - Email: info@vrijebasisschoolsijsele.be.
            - Start schooldag: 08:30. Einde: 15:30 (woensdag 11:40).
            - Warme maaltijden via Hanssens.
            - Er is voor- en naschoolse opvang 'De Verrekijker'.
            
            Als je het antwoord niet weet, verwijs dan naar het secretariaat of het contactformulier.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${systemPrompt}\n\nGebruiker vraagt: "${userMessage}"`,
        });

        return response.text || "Ik begrijp het niet helemaal, kunt u dat herhalen?";
    } catch (error) {
        console.error("Chat Error", error);
        return "Er is een technische storing, probeer het later opnieuw.";
    }
}