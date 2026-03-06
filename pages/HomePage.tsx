"use client";

import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/WalletConnect";
import { InitializeMarginAccount } from "@/components/InitializeMarginAccount";
import { AccountDashboard } from "@/components/AccountDashboard";
import { DepositAndBridge } from "@/components/DepositAndBridge";
import { RepayLoan } from "@/components/RepayLoan";
import { NetworkGuard } from "@/components/NetworkGuard";
import { RegistrationModal } from "@/components/RegistrationModal";
import { useMarginAccount } from "@/hooks/useMarginAccount";
import { usePolymarketData } from "@/hooks/usePolymarketData";

export function HomePage() {
  const { address, isConnected } = useAccount();
  const { hasMarginAccount } = useMarginAccount(address);
  const polymarketData = usePolymarketData(address);

  // Show registration modal when user is not found on Polymarket
  const showRegistrationModal = polymarketData.userNotFound;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated orbs background */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>

      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a]/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Delphic
          </h1>
          <WalletConnect />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <NetworkGuard>
          {!isConnected ? (
            <div className="text-center py-20">
              <h2 className="text-5xl font-bold text-white mb-4">
                Fund Polymarket with yield tokens
              </h2>
              <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                Deposit yield-generating tokens like stETH to borrow USDC and fund your Polymarket account
              </p>
              <div className="mt-8">
                <WalletConnect />
              </div>
            </div>
          ) : showRegistrationModal && !polymarketData.loading ? (
            <RegistrationModal
              show={showRegistrationModal}
              onClose={() => {
                // Reload to re-check after modal close
                window.location.reload();
              }}
            />
          ) : (
            <div className="space-y-8">
              {!hasMarginAccount && (
                <div className="max-w-2xl mx-auto">
                  <InitializeMarginAccount />
                </div>
              )}

              {hasMarginAccount && (
                <>
                  <AccountDashboard />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DepositAndBridge />
                    <RepayLoan />
                  </div>
                </>
              )}
            </div>
          )}
        </NetworkGuard>
      </main>
    </div>
  );
}
