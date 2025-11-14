import { NextRequest, NextResponse } from "next/server";
import { CardCondition } from "@/types";

// Condition multipliers based on typical Pokemon card pricing
const CONDITION_MULTIPLIERS: Record<CardCondition, number> = {
  "Near Mint": 1.0,
  "Lightly Played": 0.85,
  "Moderately Played": 0.65,
  "Heavily Played": 0.45,
  Damaged: 0.25,
};

export async function POST(request: NextRequest) {
  try {
    const { cardName, setName, cardNumber, condition } = await request.json();

    if (!cardName || !condition) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Try TCGPlayer API if configured
    if (process.env.TCGPLAYER_API_KEY) {
      try {
        const tcgPrice = await fetchTCGPlayerPrice(
          cardName,
          setName,
          cardNumber
        );

        if (tcgPrice) {
          const conditionMultiplier = CONDITION_MULTIPLIERS[condition as CardCondition];
          const adjustedPrice = tcgPrice.marketPrice * conditionMultiplier;

          return NextResponse.json({
            success: true,
            pricing: {
              condition,
              price: parseFloat(adjustedPrice.toFixed(2)),
              source: "TCGPlayer",
              lastUpdated: new Date().toISOString(),
              marketPrice: tcgPrice.marketPrice,
              lowPrice: tcgPrice.lowPrice,
              highPrice: tcgPrice.highPrice,
            },
          });
        }
      } catch (error) {
        console.error("TCGPlayer API error:", error);
        // Fall through to estimation
      }
    }

    // Fallback: Estimate based on typical card values
    // This is a placeholder - in production, you'd want real pricing data
    const estimatedPrice = estimateCardPrice(cardName, setName, condition as CardCondition);

    return NextResponse.json({
      success: true,
      pricing: {
        condition,
        price: estimatedPrice,
        source: "Manual",
        lastUpdated: new Date().toISOString(),
        marketPrice: estimatedPrice,
      },
    });
  } catch (error) {
    console.error("Pricing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch pricing",
      },
      { status: 500 }
    );
  }
}

async function fetchTCGPlayerPrice(
  cardName: string,
  setName: string,
  cardNumber: string
) {
  // TCGPlayer API integration
  // This requires authentication and proper API setup
  // Documentation: https://docs.tcgplayer.com/docs

  const apiKey = process.env.TCGPLAYER_API_KEY;
  const apiUrl = "https://api.tcgplayer.com/v1.39.0";

  // Step 1: Search for the card
  const searchResponse = await fetch(
    `${apiUrl}/catalog/products?categoryId=3&productName=${encodeURIComponent(cardName)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );

  if (!searchResponse.ok) {
    throw new Error("TCGPlayer search failed");
  }

  const searchData = await searchResponse.json();
  const product = searchData.results?.[0];

  if (!product) {
    return null;
  }

  // Step 2: Get pricing for the product
  const priceResponse = await fetch(
    `${apiUrl}/pricing/product/${product.productId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );

  if (!priceResponse.ok) {
    throw new Error("TCGPlayer pricing failed");
  }

  const priceData = await priceResponse.json();
  const pricing = priceData.results?.[0];

  if (!pricing) {
    return null;
  }

  return {
    marketPrice: pricing.marketPrice || pricing.midPrice || 0,
    lowPrice: pricing.lowPrice || 0,
    highPrice: pricing.highPrice || 0,
  };
}

function estimateCardPrice(
  cardName: string,
  setName: string,
  condition: CardCondition
): number {
  // This is a simple estimation function
  // In production, you'd want a database of card prices or real API data

  let basePrice = 5.0; // Default price

  // Adjust based on card name patterns (simplified heuristics)
  const nameLower = cardName.toLowerCase();

  if (
    nameLower.includes("charizard") ||
    nameLower.includes("pikachu vmax") ||
    nameLower.includes("mewtwo")
  ) {
    basePrice = 50.0;
  } else if (nameLower.includes("ex") || nameLower.includes("gx")) {
    basePrice = 15.0;
  } else if (nameLower.includes("v") || nameLower.includes("vstar")) {
    basePrice = 12.0;
  }

  // Adjust based on set (older sets are often more valuable)
  const setLower = setName.toLowerCase();
  if (setLower.includes("base set") || setLower.includes("jungle")) {
    basePrice *= 3;
  } else if (setLower.includes("fossil") || setLower.includes("rocket")) {
    basePrice *= 2;
  }

  // Apply condition multiplier
  const conditionMultiplier = CONDITION_MULTIPLIERS[condition];
  const finalPrice = basePrice * conditionMultiplier;

  return parseFloat(finalPrice.toFixed(2));
}
