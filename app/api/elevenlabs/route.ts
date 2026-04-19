import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const runtime = 'nodejs';

export const POST = async (request: Request) => {
    try {
        const { input, voice } = await request.json();

        if (!input) {
            return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
        }

        const elevenlabs = new ElevenLabsClient({ apiKey });

        const voiceId = voice || "nPczCjzI2devNBz1zQrb"; // default: Brian (premade, free)

        const audioResponse = await elevenlabs.textToSpeech.convert(voiceId, {
            text: input,
            modelId: "eleven_turbo_v2_5",
            outputFormat: "mp3_44100_128",
        });

        const reader = audioResponse.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
        }

        const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
        const audioBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            audioBuffer.set(chunk, offset);
            offset += chunk.length;
        }

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="audio.mp3"',
            },
        });
    } catch (error: any) {
        console.error("ElevenLabs error:", error?.statusCode, error?.message);
        return NextResponse.json(
            { error: error?.message || 'Failed to generate audio' },
            { status: error?.statusCode || 500 }
        );
    }
}
