export type CardCondition =
  | "Near Mint"
  | "Lightly Played"
  | "Moderately Played"
  | "Heavily Played"
  | "Damaged";

export interface PokemonCard {
  name: string;
  setName: string;
  setCode?: string;
  cardNumber: string;
  rarity?: string;
  imageUrl?: string;
}

export interface PriceData {
  condition: CardCondition;
  price: number;
  source: "TCGPlayer" | "eBay" | "Manual";
  lastUpdated: string;
  marketPrice?: number;
  lowPrice?: number;
  highPrice?: number;
}

export interface CardScan {
  id: string;
  card: PokemonCard;
  condition: CardCondition;
  pricing: PriceData;
  scannedAt: string;
  imageDataUrl?: string;
}

export interface CardRecognitionResult {
  success: boolean;
  card?: PokemonCard;
  confidence?: number;
  error?: string;
}

export interface PricingResult {
  success: boolean;
  pricing?: PriceData;
  error?: string;
}
