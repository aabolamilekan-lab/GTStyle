export function formatNaira(cents: number): string {
  const naira = cents / 100;
  return `₦${naira.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatMetalType(metalType: string): string {
  const map: Record<string, string> = {
    YELLOW_GOLD_18K: "18K Yellow Gold",
    YELLOW_GOLD_14K: "14K Yellow Gold",
    WHITE_GOLD_18K: "18K White Gold",
    WHITE_GOLD_14K: "14K White Gold",
    ROSE_GOLD_18K: "18K Rose Gold",
    ROSE_GOLD_14K: "14K Rose Gold",
    PLATINUM_950: "Platinum 950",
    STERLING_SILVER_925: "925 Sterling Silver",
  };

  return map[metalType] || metalType.replace(/_/g, " ");
}
