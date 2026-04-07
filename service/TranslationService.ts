import { chatSession } from './Gemini';

interface TranslationResponse {
  description: string;
  transcription: string;
  thumbnail: string;
}

export async function translateContent(
  content: {
    description: string;
    transcription?: string;
    thumbnail?: string;
  },
  sourceLanguage: string = 'English',
  targetLanguage: string
): Promise<TranslationResponse> {
  try {
    // Create translation prompt
    const translationPrompt = `
      Translate the following content from ${sourceLanguage} to ${targetLanguage}. 
      Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
      {
        "description": "translated description",
        "transcription": "translated transcription",
        "thumbnail": "translated thumbnail details"
      }
      
      Content to translate:
      Description: ${content.description}
      Transcription: ${content.transcription || ''}
      Thumbnail: ${content.thumbnail || ''}
    `;
    
    const result = await chatSession.sendMessage(translationPrompt);
    const text = result.response.text();
    
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const translatedContent = JSON.parse(cleanText);
    
    return {
      description: translatedContent.description,
      transcription: translatedContent.transcription,
      thumbnail: translatedContent.thumbnail
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate content');
  }
}