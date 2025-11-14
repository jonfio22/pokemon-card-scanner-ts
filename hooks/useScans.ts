"use client";

import { useState, useEffect } from "react";
import { CardScan } from "@/types";
import { storageService } from "@/lib/services/storage";

export function useScans() {
  const [scans, setScans] = useState<CardScan[]>([]);

  // Load scans from localStorage on mount
  useEffect(() => {
    setScans(storageService.getAllScans());
  }, []);

  const addScan = (scan: CardScan) => {
    storageService.saveScan(scan);
    setScans(storageService.getAllScans());
  };

  const deleteScan = (id: string) => {
    storageService.deleteScan(id);
    setScans(storageService.getAllScans());
  };

  const clearAll = () => {
    storageService.clearAllScans();
    setScans([]);
  };

  const exportToCSV = () => {
    storageService.downloadCSV();
  };

  return {
    scans,
    addScan,
    deleteScan,
    clearAll,
    exportToCSV,
  };
}
