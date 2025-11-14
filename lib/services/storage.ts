import { CardScan } from "@/types";

const STORAGE_KEY = "pokemon-card-scans";

export const storageService = {
  // Get all scans from localStorage
  getAllScans(): CardScan[] {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  // Save a new scan
  saveScan(scan: CardScan): void {
    if (typeof window === "undefined") return;

    try {
      const scans = this.getAllScans();
      scans.unshift(scan); // Add to beginning
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  // Delete a scan by ID
  deleteScan(id: string): void {
    if (typeof window === "undefined") return;

    try {
      const scans = this.getAllScans().filter((scan) => scan.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    } catch (error) {
      console.error("Error deleting from localStorage:", error);
    }
  },

  // Clear all scans
  clearAllScans(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },

  // Export scans to CSV
  exportToCSV(): string {
    const scans = this.getAllScans();

    if (scans.length === 0) {
      return "";
    }

    // CSV Header
    const headers = [
      "Scan Date",
      "Card Name",
      "Set Name",
      "Card Number",
      "Condition",
      "Price",
      "Source",
      "Market Price",
    ];

    // CSV Rows
    const rows = scans.map((scan) => [
      new Date(scan.scannedAt).toLocaleString(),
      scan.card.name,
      scan.card.setName,
      scan.card.cardNumber,
      scan.condition,
      `$${scan.pricing.price.toFixed(2)}`,
      scan.pricing.source,
      scan.pricing.marketPrice
        ? `$${scan.pricing.marketPrice.toFixed(2)}`
        : "N/A",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n");

    return csvContent;
  },

  // Download CSV file
  downloadCSV(): void {
    const csv = this.exportToCSV();

    if (!csv) {
      alert("No scans to export");
      return;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pokemon-card-scans-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
