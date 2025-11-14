"use client";

import { CardCondition } from "@/types";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConditionSelectorProps {
  value: CardCondition;
  onChange: (condition: CardCondition) => void;
  disabled?: boolean;
}

const conditions: CardCondition[] = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
];

const conditionDescriptions: Record<CardCondition, string> = {
  "Near Mint": "Looks fresh from the pack, minimal wear",
  "Lightly Played": "Minor edge wear, slight scratches",
  "Moderately Played": "Noticeable wear, some whitening",
  "Heavily Played": "Significant wear, creases visible",
  Damaged: "Major damage, heavily worn or bent",
};

export function ConditionSelector({
  value,
  onChange,
  disabled,
}: ConditionSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value as CardCondition)}
            disabled={disabled}
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Select>
          <p className="text-sm text-slate-500">
            {conditionDescriptions[value]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
