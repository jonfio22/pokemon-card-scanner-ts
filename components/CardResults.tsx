"use client";

import { PokemonCard, PriceData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface CardResultsProps {
  card: PokemonCard;
  pricing: PriceData;
}

export function CardResults({ card, pricing }: CardResultsProps) {
  return (
    <div className="space-y-4">
      {/* Card Information */}
      <Card>
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-lg font-semibold">{card.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Set</p>
                <p className="font-medium">{card.setName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Number</p>
                <p className="font-medium">{card.cardNumber}</p>
              </div>
            </div>
            {card.rarity && (
              <div>
                <p className="text-sm text-slate-500">Rarity</p>
                <Badge variant="secondary">{card.rarity}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Price Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Current Value</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <p className="text-3xl font-bold text-green-600">
                    ${pricing.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Condition: {pricing.condition}
                </p>
              </div>
              <Badge variant="outline">{pricing.source}</Badge>
            </div>

            {pricing.marketPrice && pricing.marketPrice !== pricing.price && (
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-500 mb-2">Market Breakdown</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {pricing.lowPrice && (
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-xs text-slate-500">Low</p>
                        <p className="font-medium">${pricing.lowPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500">Market</p>
                    <p className="font-medium">${pricing.marketPrice.toFixed(2)}</p>
                  </div>
                  {pricing.highPrice && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-slate-500">High</p>
                        <p className="font-medium">${pricing.highPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400">
              Last updated: {new Date(pricing.lastUpdated).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
