import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert data URL to base64 and extract mime type
    const base64Data = image.split(",")[1];
    const mimeType = image.split(";")[0].split(":")[1];

    // Use Gemini Vision to identify the card
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      `Analyze this Pokemon card image and extract the following information in JSON format:
{
  "name": "exact card name",
  "setName": "set name (e.g., Base Set, Jungle, etc.)",
  "setCode": "set code if visible",
  "cardNumber": "card number (e.g., 1/102)",
  "rarity": "rarity (Common, Uncommon, Rare, etc.)"
}

Be as accurate as possible. If you cannot determine a field, use "Unknown". Only respond with valid JSON.`,
    ]);

    const response = await result.response;
    const content = response.text();

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Failed to analyze image" },
        { status: 500 }
      );
    }

    // Parse the JSON response (remove markdown code blocks if present)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid response format from Gemini" },
        { status: 500 }
      );
    }

    const cardData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      card: {
        name: cardData.name || "Unknown",
        setName: cardData.setName || "Unknown",
        setCode: cardData.setCode,
        cardNumber: cardData.cardNumber || "Unknown",
        rarity: cardData.rarity,
      },
      confidence: 0.9, // Gemini Vision is generally highly confident
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
