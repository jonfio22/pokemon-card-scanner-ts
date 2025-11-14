"use client";

import { CardScan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, History } from "lucide-react";

interface ScanHistoryProps {
  scans: CardScan[];
  onExport: () => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export function ScanHistory({
  scans,
  onExport,
  onClear,
  onDelete,
}: ScanHistoryProps) {
  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            No scans yet. Start by scanning your first card!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Scan History ({scans.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Clear all scan history?")) {
                  onClear();
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{scan.card.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {scan.card.cardNumber}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {scan.card.setName} • {scan.condition}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(scan.scannedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ${scan.pricing.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">{scan.pricing.source}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm("Delete this scan?")) {
                      onDelete(scan.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
