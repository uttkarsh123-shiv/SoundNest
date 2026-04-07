import OpenAI from 'openai';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("NEXT_PUBLIC_OPENAI_API_KEY is not set. Get one from https://platform.openai.com/api-keys");
}

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Only for client-side usage
});

export async function generateContent(prompt: string): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates podcast content in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 1,
            max_tokens: 2000,
        });

        return completion.choices[0].message.content || "";
    } catch (error: any) {
        console.error('OpenAI API error:', error);
        
        // Handle rate limit error
        if (error.status === 429) {
            throw new Error('OpenAI API quota exceeded. Please add credits at https://platform.openai.com/account/billing or wait for quota reset.');
        }
        
        throw new Error(`OpenAI API error: ${error.message}`);
    }
}

// Chat session simulation for compatibility
export const chatSession = {
    async sendMessage(prompt: string) {
        const text = await generateContent(prompt);
        return {
            response: {
                text: () => text
            }
        };
    }
};

export { openai };
