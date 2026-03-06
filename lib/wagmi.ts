import { http, createConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL! || "https://eth.merkle.io/"),
    [polygon.id]: http("https://polygon-rpc.com"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
