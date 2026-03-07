"use client";

import { PolymarketEvent } from "@/lib/polymarket/types";

interface MarketCardProps {
  market: PolymarketEvent;
}

export function MarketCard({ market }: MarketCardProps) {
  // Get the first market from the event for display
  const firstMarket = market.markets?.[0];

  // Parse outcomes and prices from the first market
  let outcomes: string[] = [];
  let outcomePrices: string[] = [];

  try {
    if (firstMarket) {
      outcomes = firstMarket.outcomes ? JSON.parse(firstMarket.outcomes) : [];
      outcomePrices = firstMarket.outcomePrices ? JSON.parse(firstMarket.outcomePrices) : [];
    }
  } catch (e) {
    console.error("Error parsing market data:", e);
  }

  // Format volume and liquidity
  const formatCurrency = (value?: number | string) => {
    if (!value) return "$0";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toFixed(0)}`;
  };

  // Format end date
  const formatEndDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return null;
    }
  };

  // Get top 2 outcomes for display
  const topOutcomes = outcomes.slice(0, 2);
  const topPrices = outcomePrices.slice(0, 2);

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-all">
      {/* Header with icon and title */}
      <div className="flex items-start gap-3 mb-3">
        {(market.icon || market.image) && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-[#2a2a2a]">
            <img
              src={market.icon || market.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2">
            {market.title}
          </h3>
          {market.subtitle && (
            <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{market.subtitle}</p>
          )}
        </div>
      </div>

      {/* Outcomes from first market */}
      {topOutcomes.length > 0 && (
        <div className="space-y-2 mb-3">
          {topOutcomes.map((outcome, idx) => {
            const price = topPrices[idx] ? parseFloat(topPrices[idx]) * 100 : 0;
            const isYes = outcome.toLowerCase().includes("yes");
            const isNo = outcome.toLowerCase().includes("no");

            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isYes
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : isNo
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    }`}
                  >
                    {outcome}
                  </button>
                </div>
                <span className="text-white font-medium text-sm">
                  {price.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer with volume and end date */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          {market.volume && (
            <span className="flex items-center gap-1">
              <span>Vol.</span>
              <span className="text-zinc-300">{formatCurrency(market.volume)}</span>
            </span>
          )}
          {market.endDate && (
            <span className="flex items-center gap-1">
              <span>Ends</span>
              <span className="text-zinc-300">{formatEndDate(market.endDate)}</span>
            </span>
          )}
          {market.markets && market.markets.length > 1 && (
            <span className="text-zinc-300">{market.markets.length} markets</span>
          )}
        </div>
        {market.closed && (
          <span className="text-red-400 font-medium">CLOSED</span>
        )}
      </div>
    </div>
  );
}
