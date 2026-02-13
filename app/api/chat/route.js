import { NextResponse } from "next/server";
import { systemPrompt } from "../../../components/ai/prompts";
import { getAvailableModels } from "../../../components/geminiClient";
import { ratelimit } from "../../../components/ai/ratelimit";
import { getCachedResponse, setCachedResponse } from "../../../components/ai/cache";

export async function POST(req) {
    try {
        const { message, token } = await req.json();

        // 1️⃣ Secret token verification
        if (!token || token !== process.env.NEXT_PUBLIC_CHAT_SECRET_TOKEN) {
            return NextResponse.json(
                { reply: "Unauthorized request." },
                { status: 401 }
            );
        }

        if (!message || message.trim() === "") {
            return NextResponse.json({ reply: "Please enter a question." });
        }

        // 2️⃣ Rate limiting per IP
        const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json(
                { reply: "Rate limit exceeded. Try again later." },
                { status: 429 }
            );
        }

        // 3️⃣ Check cache
        const cacheKey = `chat:${message.trim().toLowerCase()}`;
        const cached = await getCachedResponse(cacheKey);
        if (cached) {
            return NextResponse.json({ reply: cached });
        }

        // 4️⃣ Fetch available models
        const models = await getAvailableModels(process.env.GEMINI_API_KEY);
        if (!models.length) {
            return NextResponse.json({ reply: "No available AI models." });
        }
        const modelName = models[0].name;

        // 5️⃣ Send to Gemini
        const body = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${systemPrompt}\n\nUser question: ${message}`,
                        },
                    ],
                },
            ],
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error("Gemini API failed:", responseText);
            return NextResponse.json(
                { reply: `AI service error (${response.status}): ${responseText.slice(0, 100)}` },
                { status: response.status }
            );
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", parseError);
            return NextResponse.json(
                { reply: `Invalid response from AI service` },
                { status: 500 }
            );
        }

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "Sorry, I couldn't generate a response.";

        // 6️⃣ Cache the response for future requests
        await setCachedResponse(cacheKey, reply, 3600); // 1 hour

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Error in /api/chat:", error.message, error.stack);
        return NextResponse.json(
            { reply: `Error: ${error.message}` },
            { status: 500 }
        );
    }
}