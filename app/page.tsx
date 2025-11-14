"use client";

import { useState } from "react";
import { CardUpload } from "@/components/CardUpload";
import { ConditionSelector } from "@/components/ConditionSelector";
import { CardResults } from "@/components/CardResults";
import { ScanHistory } from "@/components/ScanHistory";
import { Button } from "@/components/ui/button";
import { useScans } from "@/hooks/useScans";
import {
  CardCondition,
  PokemonCard,
  PriceData,
  CardRecognitionResult,
  PricingResult,
} from "@/types";
import { Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isPricing, setIsPricing] = useState(false);
  const [recognizedCard, setRecognizedCard] = useState<PokemonCard | null>(null);
  const [pricing, setPricing] = useState<PriceData | null>(null);
  const [condition, setCondition] = useState<CardCondition>("Near Mint");
  const [error, setError] = useState<string | null>(null);

  const { scans, addScan, deleteScan, clearAll, exportToCSV } = useScans();

  const handleImageSelected = async (imageData: string, file: File) => {
    setSelectedImage(imageData);
    setRecognizedCard(null);
    setPricing(null);
    setError(null);
    setIsRecognizing(true);

    try {
      // Recognize the card using GPT-4 Vision
      const recognizeResponse = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const recognizeResult: CardRecognitionResult = await recognizeResponse.json();

      if (!recognizeResult.success || !recognizeResult.card) {
        throw new Error(recognizeResult.error || "Failed to recognize card");
      }

      setRecognizedCard(recognizeResult.card);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recognize card");
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleGetPrice = async () => {
    if (!recognizedCard) return;

    setIsPricing(true);
    setError(null);

    try {
      const pricingResponse = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardName: recognizedCard.name,
          setName: recognizedCard.setName,
          cardNumber: recognizedCard.cardNumber,
          condition,
        }),
      });

      const pricingResult: PricingResult = await pricingResponse.json();

      if (!pricingResult.success || !pricingResult.pricing) {
        throw new Error(pricingResult.error || "Failed to get pricing");
      }

      setPricing(pricingResult.pricing);

      // Save to history
      addScan({
        id: Date.now().toString(),
        card: recognizedCard,
        condition,
        pricing: pricingResult.pricing,
        scannedAt: new Date().toISOString(),
        imageDataUrl: selectedImage || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get pricing");
    } finally {
      setIsPricing(false);
    }
  };

  const handleNewScan = () => {
    setSelectedImage(null);
    setRecognizedCard(null);
    setPricing(null);
    setError(null);
    setCondition("Near Mint");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Pokemon Card Scanner
          </h1>
          <p className="text-slate-600">
            Scan your cards and get instant market valuations
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Upload & Recognition */}
          <div className="space-y-6">
            <CardUpload
              onImageSelected={handleImageSelected}
              isLoading={isRecognizing || isPricing}
            />

            {isRecognizing && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-lg">Analyzing card...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {recognizedCard && !pricing && (
              <div className="space-y-4">
                <ConditionSelector
                  value={condition}
                  onChange={setCondition}
                  disabled={isPricing}
                />

                <Button
                  className="w-full h-12 text-lg"
                  onClick={handleGetPrice}
                  disabled={isPricing}
                >
                  {isPricing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Getting Price...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Price Estimate
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div>
            {recognizedCard && pricing && (
              <div className="space-y-4">
                <CardResults card={recognizedCard} pricing={pricing} />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleNewScan}
                >
                  Scan Another Card
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Scan History */}
        <ScanHistory
          scans={scans}
          onExport={exportToCSV}
          onClear={clearAll}
          onDelete={deleteScan}
        />
      </div>
    </div>
  );
}
