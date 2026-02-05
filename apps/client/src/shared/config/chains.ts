export const L1_CHAINS = [
  {
    key: 'sepolia',
    name: 'Sepolia',
  },
] as const;

export const L2_CHAINS = [
  {
    key: 'op-sepolia',
    name: 'OP Sepolia',
  },
  {
    key: 'worldchain-sepolia',
    name: 'Worldchain Sepolia',
  },
  {
    key: 'uni-sepolia',
    name: 'UniChain Sepolia',
  },
] as const;

export const CHAINS = [...L1_CHAINS, ...L2_CHAINS] as const;
