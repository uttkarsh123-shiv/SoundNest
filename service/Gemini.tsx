export async function generateContent(prompt: string): Promise<string> {
    const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate content');
    return data.text;
}

export const chatSession = {
    async sendMessage(prompt: string) {
        const text = await generateContent(prompt);
        return { response: { text: () => text } };
    }
};
