export const BRIDGE_TOKENS = [
  {
    key: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xaB95e0280eA9c3dCF906eecD4A40Cba079475307',
  },
  {
    key: 'op',
    name: 'Optimism',
    symbol: 'OP',
    address: '0xaB95e0280eA9c3dCF906eecD4A40Cba079475307',
  },
  {
    key: 'coffee_token',
    name: 'Coffee Token',
    symbol: 'COFFEE',
    address: '0xaB95e0280eA9c3dCF906eecD4A40Cba079475307',
  },
];

export const BRIDGE_TOKENS_MAP = new Map(BRIDGE_TOKENS.map((t) => [t.key, t]));
