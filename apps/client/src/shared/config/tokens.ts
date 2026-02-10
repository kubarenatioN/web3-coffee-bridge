import type { ChainType } from '../types/chains.types';

interface Token {
  name: string;
  symbol: string;
  decimals: number;
  icon?: string;
  native?: boolean;
  tokens?: Partial<Record<ChainType, { address: string }>>;
}

export const BRIDGE_TOKENS: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    icon: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
    native: true,
  },
  {
    name: 'Pepe',
    symbol: 'PEPE',
    decimals: 18,
    icon: 'https://ethereum-optimism.github.io/data/PEPE/logo.svg',
    tokens: {
      'ethereum-sepolia': {
        address: '??',
      },
      // ethereum: {
      //   address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      // },
    },
  },
  {
    name: 'Coffee Token',
    symbol: 'COFFEE',
    decimals: 18,
    icon: 'assets/coffee-token-logo.jpg',
    tokens: {
      'ethereum-sepolia': {
        address: '0xab95e0280ea9c3dcf906eecd4a40cba079475307',
      },
      'op-sepolia': {
        address: '0x567E771017e5F7daD7C2db3721b07B501cd7952c',
      },
      'worldchain-sepolia': {
        address: '0x567E771017e5F7daD7C2db3721b07B501cd7952c',
      },
      'base-sepolia': {
        address: '0x567E771017e5F7daD7C2db3721b07B501cd7952c',
      },
    },
  },
];

export const BRIDGE_TOKENS_MAP = new Map(BRIDGE_TOKENS.map((t) => [t.name, t]));
