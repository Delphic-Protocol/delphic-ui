"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400 bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#2a2a2a]">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-[#252525] border border-[#2a2a2a] transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-6 py-3 text-sm font-semibold text-white bg-[#ff1cf7] rounded-xl hover:bg-[#e019db] transition-all shadow-lg shadow-[#ff1cf7]/20"
    >
      Connect MetaMask
    </button>
  );
}
