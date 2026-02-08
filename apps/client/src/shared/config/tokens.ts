export const BRIDGE_TOKENS = [
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
      ethereum: {
        address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      },
      op: {
        address: '0xc1c167cc44f7923cd0062c4370df962f9ddb16f5',
      },
      base: {
        address: '0xb4fde59a779991bfb6a52253b51947828b982be3',
      },
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
        address: '0xA366D3D9F564FF49A0862448dE49cF3fbe512aF9',
      },
      'worldchain-sepolia': {
        address: '0xA366D3D9F564FF49A0862448dE49cF3fbe512aF9',
      },
      'uni-sepolia': {
        address: '0xA366D3D9F564FF49A0862448dE49cF3fbe512aF9',
      },
    },
  },
];

export const BRIDGE_TOKENS_MAP = new Map(BRIDGE_TOKENS.map((t) => [t.name, t]));
