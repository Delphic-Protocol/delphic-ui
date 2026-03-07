"use client";

import React, { useState } from "react";
import { PolymarketEvent } from "@/lib/polymarket/types";

interface MarketModalProps {
  event: PolymarketEvent;
  onClose: () => void;
  embedded?: boolean;
  selectedMarketIndex?: number;
  initialSelectedOutcome?: number;
}

export function MarketModal({ event, onClose, embedded = false, selectedMarketIndex = 0, initialSelectedOutcome = 0 }: MarketModalProps) {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [selectedOutcome, setSelectedOutcome] = useState<number>(initialSelectedOutcome);
  const [amount, setAmount] = useState<string>("0");

  // Update selected outcome when initialSelectedOutcome changes
  React.useEffect(() => {
    setSelectedOutcome(initialSelectedOutcome);
  }, [initialSelectedOutcome]);

  // Get the selected market from the event
  const market = event.markets?.[selectedMarketIndex] || event.markets?.[0];

  // Parse outcomes and prices
  let outcomes: string[] = [];
  let outcomePrices: string[] = [];

  try {
    if (market) {
      outcomes = market.outcomes ? JSON.parse(market.outcomes) : [];
      outcomePrices = market.outcomePrices ? JSON.parse(market.outcomePrices) : [];
    }
  } catch (e) {
    console.error("Error parsing market data:", e);
  }

  const addAmount = (value: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + value).toFixed(2));
  };

  const setMaxAmount = () => {
    // TODO: Get actual balance
    setAmount("5.00");
  };

  const handleBuy = () => {
    // TODO: Implement buy logic
    console.log("Buy", {
      outcome: outcomes[selectedOutcome],
      amount,
      tab,
    });
  };

  // Embedded mode for EventPage sidebar
  if (embedded) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full">
        {/* Trading interface */}
        <div className="p-6">
          {/* Market selector */}
          {event.markets && event.markets.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {(event.icon || event.image) && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2a2a2a]">
                    <img
                      src={event.icon || event.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-white font-medium">{market?.question}</span>
              </div>
            </div>
          )}

          {/* Buy/Sell tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setTab("buy")}
              className={`text-xl font-bold transition-colors relative pb-2 ${
                tab === "buy" ? "text-white" : "text-zinc-500"
              }`}
            >
              Buy
              {tab === "buy" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => setTab("sell")}
              className={`text-xl font-bold transition-colors relative pb-2 ${
                tab === "sell" ? "text-white" : "text-zinc-500"
              }`}
            >
              Sell
              {tab === "sell" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
            {event.markets && event.markets.length > 1 && (
              <div className="ml-auto">
                <button className="px-3 py-1.5 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-colors flex items-center gap-2">
                  Market
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Outcome selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {outcomes.map((outcome, idx) => {
              const price = outcomePrices[idx] ? parseFloat(outcomePrices[idx]) * 100 : 0;
              const isSelected = selectedOutcome === idx;
              const isYes = outcome.toLowerCase().includes("yes");

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedOutcome(idx)}
                  className={`px-6 py-4 rounded-xl text-lg font-bold transition-all ${
                    isSelected
                      ? isYes
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-[#2a2a2a] text-zinc-400"
                  }`}
                >
                  {outcome} {price.toFixed(0)}¢
                </button>
              );
            })}
          </div>

          {/* Amount input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white text-lg font-bold">Amount</label>
              <div className="text-zinc-400 text-sm">Balance $5.00</div>
            </div>

            <div className="mb-4">
              <div className="text-right">
                <input
                  type="text"
                  value={`$${amount}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setAmount(val);
                  }}
                  className="bg-transparent text-4xl font-bold text-zinc-400 text-right w-full outline-none"
                />
              </div>
            </div>

            {/* Quick amount buttons */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => addAmount(1)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$1
              </button>
              <button
                onClick={() => addAmount(5)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$5
              </button>
              <button
                onClick={() => addAmount(10)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$10
              </button>
              <button
                onClick={() => addAmount(100)}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$100
              </button>
              <button
                onClick={setMaxAmount}
                className="flex-1 px-3 py-2 bg-[#2a2a2a] text-white text-sm rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                Max
              </button>
            </div>
          </div>

          {/* Buy button */}
          <button
            onClick={handleBuy}
            className="w-full py-4 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors mb-4"
          >
            {tab === "buy" ? "Buy" : "Sell"} {outcomes[selectedOutcome]}
          </button>

          <p className="text-zinc-500 text-xs text-center">
            By trading, you agree to the{" "}
            <a href="#" className="underline hover:text-zinc-400">
              Terms of Use
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-zinc-400 text-sm">{event.subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Market selector dropdown */}
          {event.markets && event.markets.length > 1 && (
            <div className="relative">
              <button className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-left flex items-center justify-between hover:border-[#3a3a3a] transition-colors">
                <span>{market?.question}</span>
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Trading interface */}
        <div className="p-6">
          {/* Buy/Sell tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setTab("buy")}
              className={`text-2xl font-bold transition-colors relative pb-2 ${
                tab === "buy" ? "text-white" : "text-zinc-500"
              }`}
            >
              Buy
              {tab === "buy" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => setTab("sell")}
              className={`text-2xl font-bold transition-colors relative pb-2 ${
                tab === "sell" ? "text-white" : "text-zinc-500"
              }`}
            >
              Sell
              {tab === "sell" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* Outcome selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {outcomes.map((outcome, idx) => {
              const price = outcomePrices[idx] ? parseFloat(outcomePrices[idx]) * 100 : 0;
              const isSelected = selectedOutcome === idx;
              const isYes = outcome.toLowerCase().includes("yes");

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedOutcome(idx)}
                  className={`px-6 py-4 rounded-xl text-lg font-bold transition-all ${
                    isSelected
                      ? isYes
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-[#2a2a2a] text-zinc-400"
                  }`}
                >
                  {outcome} {price.toFixed(0)}¢
                </button>
              );
            })}
          </div>

          {/* Amount input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white text-xl font-bold">Amount</label>
              <div className="text-zinc-400 text-sm">Balance $5.00</div>
            </div>

            <div className="mb-4">
              <div className="text-right">
                <input
                  type="text"
                  value={`$${amount}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setAmount(val);
                  }}
                  className="bg-transparent text-5xl font-bold text-zinc-400 text-right w-full outline-none"
                />
              </div>
            </div>

            {/* Quick amount buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => addAmount(1)}
                className="flex-1 px-4 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$1
              </button>
              <button
                onClick={() => addAmount(5)}
                className="flex-1 px-4 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$5
              </button>
              <button
                onClick={() => addAmount(10)}
                className="flex-1 px-4 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$10
              </button>
              <button
                onClick={() => addAmount(100)}
                className="flex-1 px-4 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                +$100
              </button>
              <button
                onClick={setMaxAmount}
                className="flex-1 px-4 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium"
              >
                Max
              </button>
            </div>
          </div>

          {/* Buy button */}
          <button
            onClick={handleBuy}
            className="w-full py-4 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors"
          >
            {tab === "buy" ? "Buy" : "Sell"} {outcomes[selectedOutcome]}
          </button>
        </div>
      </div>
    </div>
  );
}
