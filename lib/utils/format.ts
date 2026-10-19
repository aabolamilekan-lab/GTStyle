export function formatNaira(cents: number): string {
  const naira = cents / 100;
  return `₦${naira.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatMetalType(metalType: string): string {
  const map: Record<string, string> = {
    YELLOW_GOLD_18K: "Gold Finish",
    YELLOW_GOLD_14K: "Gold Finish",
    WHITE_GOLD_18K: "Silver / White Finish",
    WHITE_GOLD_14K: "Silver / White Finish",
    ROSE_GOLD_18K: "Rose Gold Finish",
    ROSE_GOLD_14K: "Rose Gold Finish",
    PLATINUM_950: "Silver Finish",
    STERLING_SILVER_925: "Silver Finish",
  };

  return map[metalType] || metalType.replace(/_/g, " ");
}
