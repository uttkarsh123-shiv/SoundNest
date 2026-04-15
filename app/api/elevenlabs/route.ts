import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

export const POST = async (request: Request) => {
    try {
        const { input, voice } = await request.json();

        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
        }

        const elevenlabs = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });

        const audioResponse: any = await elevenlabs.generate({
            voice: voice,
            text: input,
            model_id: "eleven_turbo_v2_5",
        });

        const readableAudio = Readable.from(audioResponse);
        const chunks: Uint8Array[] = [];

        for await (const chunk of readableAudio) {
            chunks.push(chunk instanceof Buffer ? new Uint8Array(chunk) : chunk);
        }

        const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
        const audioBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) { audioBuffer.set(chunk, offset); offset += chunk.length; }

        return new NextResponse(new Uint8Array(audioBuffer), {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="audio.mp3"',
            },
        });
    } catch (error: any) {
        console.log("ERROR : ", error);
        const status = error?.statusCode || 500;
        const message = status === 402
            ? 'ElevenLabs quota exceeded or TTS access not enabled on your API key. Go to elevenlabs.io → API Keys → enable Text to Speech access.'
            : error.message || 'Failed to generate audio';
        return NextResponse.json({ error: message }, { status });
    }
}
