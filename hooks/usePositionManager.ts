"use client";

import { useState } from "react";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { ClobClient, OrderType, Side, SignatureType } from "@polymarket/clob-client";

const CLOB_HOST = "https://clob.polymarket.com";
const CHAIN_ID = 137; // Polygon mainnet

interface OpenPositionParams {
  tokenId: string;
  amount: string;
  side: Side;
  safeAddress: string;
}

interface ClosePositionParams {
  marketId: string;
  outcomeIndex: number;
  amount: string;
}

interface PositionManagerResult {
  openPosition: (params: OpenPositionParams) => Promise<void>;
  closePosition: (params: ClosePositionParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
}

export function usePositionManager(): PositionManagerResult {
  const cId = useChainId()
  console.log("CHAIN_ID", cId)
  const { address, chainId } = useAccount()
  // Get wallet client for any chain first
  const { data: walletClient } = useWalletClient({ chainId });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const openPosition = async ({
    tokenId,
    amount,
    side,
    safeAddress,
  }: OpenPositionParams) => {
    if (!address || !walletClient) {
      setError("Wallet not connected");
      return;
    }

    if (!safeAddress) {
      setError("Safe address not found");
      return;
    }

    // Check that wallet is on Polygon
    if (chainId !== CHAIN_ID) {
      console.log("Current Chain ID", chainId)
      setError(`Please switch to Polygon network (current: ${chainId || "unknown"})`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      console.log("[1/3] Setting up CLOB client...");
      console.log(`  EOA:  ${address}`);
      console.log(`  Safe: ${safeAddress}`);
      console.log(`  Token ID: ${tokenId}`);
      console.log(`  Side: ${side}`);

      // Read CLOB API credentials from environment variables
      const creds = {
        key: process.env.NEXT_PUBLIC_CLOB_API_KEY!,
        secret: process.env.NEXT_PUBLIC_CLOB_SECRET!,
        passphrase: process.env.NEXT_PUBLIC_CLOB_PASSPHRASE!,
      };

      if (!creds.key || !creds.secret || !creds.passphrase) {
        throw new Error("CLOB API credentials not configured");
      }

      const client = new ClobClient(
        CLOB_HOST,
        CHAIN_ID,
        walletClient as any, // TODO: Convert viem WalletClient to ethers Signer
        creds,
        SignatureType.POLY_GNOSIS_SAFE,
        safeAddress as `0x${string}`,
      );

      console.log("\n[3/3] Signing market order...");
      const order = await client.createMarketOrder({
        tokenID: tokenId,
        side: side,
        amount: parseFloat(amount),
        orderType: OrderType.FOK
      });

      console.log("  Order signed ✓");
      console.log("  Order ID:", order.orderID);

      // Store order ID as txHash
      setTxHash(String(order.orderID || "pending"));
    } catch (err) {
      console.error("Error opening position:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to open position";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closePosition = async ({
    marketId,
    outcomeIndex,
    amount,
  }: ClosePositionParams) => {
    if (!address) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // TODO: Implement actual position closing logic
      // This will involve:
      // 1. Approve outcome token spend if needed
      // 2. Call Polymarket contract to sell outcome tokens
      // 3. Handle transaction confirmation

      console.log("Closing position:", {
        marketId,
        outcomeIndex,
        amount,
        user: address,
      });

      // Placeholder for actual implementation
      // const tx = await contract.sellOutcome(marketId, outcomeIndex, amount);
      // const receipt = await tx.wait();
      // setTxHash(receipt.transactionHash);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock transaction hash
      setTxHash("0x" + Math.random().toString(16).substring(2, 66));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to close position";
      setError(errorMessage);
      console.error("Error closing position:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    openPosition,
    closePosition,
    isLoading,
    error,
    txHash,
  };
}
