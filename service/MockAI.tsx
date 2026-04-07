// Mock AI service for when API quotas are exceeded
// This allows the app to function without crashing

export async function generateContent(prompt: string): Promise<string> {
    // Return mock podcast content
    return JSON.stringify({
        description: "This is a sample podcast description. AI content generation is currently unavailable due to API quota limits.",
        script: "Welcome to this podcast! This is sample content generated as a fallback. To enable AI-powered content generation, please add credits to your OpenAI account at https://platform.openai.com/account/billing"
    });
}

// Chat session simulation
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
