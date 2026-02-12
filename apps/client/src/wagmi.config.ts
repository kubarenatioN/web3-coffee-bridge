import { http } from 'viem';
import { baseSepolia, optimismSepolia, sepolia, worldchainSepolia } from 'viem/chains';
import { createConfig, injected } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

const config = createConfig({
  chains: [sepolia, optimismSepolia, baseSepolia, worldchainSepolia],
  transports: {
    [sepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [worldchainSepolia.id]: http(),
  },
  connectors: [metaMask(), injected({ target: 'phantom' })],
});

export { config };
