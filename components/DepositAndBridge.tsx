"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useMarginAccount } from "@/hooks/useMarginAccount";
import { MarginAccountABI } from "@/lib/contracts/abis";
import { parseUnits } from "viem";

export function DepositAndBridge() {
  const { address } = useAccount();
  const { marginAccountAddress, hasMarginAccount } = useMarginAccount(address);
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleDeposit = () => {
    if (!marginAccountAddress || !depositAmount || !borrowAmount) return;

    try {
      const depositWei = parseUnits(depositAmount, 18);
      const borrowWei = parseUnits(borrowAmount, 6); // USDC has 6 decimals

      writeContract({
        address: marginAccountAddress,
        abi: MarginAccountABI,
        functionName: "depositBorrowAndBridge",
        args: [depositWei, borrowWei],
      });
    } catch (err) {
      console.error("Error preparing transaction:", err);
    }
  };

  if (!hasMarginAccount) {
    return (
      <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
        <p className="text-sm text-zinc-400">
          Initialize a margin account first to deposit funds.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Deposit & Bridge to Polymarket
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Deposit Amount (stETH)
          </label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            className="w-full px-4 py-3 border border-[#2a2a2a] rounded-xl bg-[#0a0a0a] text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff1cf7] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Borrow Amount (USDC)
          </label>
          <input
            type="number"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(e.target.value)}
            placeholder="0.0"
            step="0.01"
            className="w-full px-4 py-3 border border-[#2a2a2a] rounded-xl bg-[#0a0a0a] text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff1cf7] transition-colors"
          />
          <p className="mt-1 text-xs text-zinc-500">
            This USDC will be borrowed against your collateral and bridged to Polymarket
          </p>
        </div>

        <button
          onClick={handleDeposit}
          disabled={!depositAmount || !borrowAmount || isPending || isConfirming}
          className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#ff1cf7] rounded-xl hover:bg-[#e019db] disabled:bg-zinc-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#ff1cf7]/20"
        >
          {isPending || isConfirming ? "Processing..." : "Deposit & Bridge"}
        </button>

        {isSuccess && (
          <p className="text-sm text-green-400">
            Successfully deposited and bridged to Polymarket!
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400">
            Error: {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
