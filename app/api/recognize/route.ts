import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Use GPT-4 Vision to identify the card
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this Pokemon card image and extract the following information in JSON format:
{
  "name": "exact card name",
  "setName": "set name (e.g., Base Set, Jungle, etc.)",
  "setCode": "set code if visible",
  "cardNumber": "card number (e.g., 1/102)",
  "rarity": "rarity (Common, Uncommon, Rare, etc.)"
}

Be as accurate as possible. If you cannot determine a field, use "Unknown". Only respond with valid JSON.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Failed to analyze image" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const cardData = JSON.parse(content);

    return NextResponse.json({
      success: true,
      card: {
        name: cardData.name || "Unknown",
        setName: cardData.setName || "Unknown",
        setCode: cardData.setCode,
        cardNumber: cardData.cardNumber || "Unknown",
        rarity: cardData.rarity,
      },
      confidence: 0.9, // GPT-4 Vision is generally highly confident
    });
  } catch (error) {
    console.error("Card recognition error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to recognize card",
      },
      { status: 500 }
    );
  }
}
