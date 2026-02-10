/* eslint-disable @typescript-eslint/no-unused-vars */

const L1_CHAINS_TESTNETS = [
  {
    key: 'ethereum-sepolia',
    name: 'Sepolia',
    id: 11155111,
  },
] as const;

const L1_CHAINS_MAINNETS = [
  {
    key: 'ethereum',
    name: 'Ethereum',
    id: 1,
  },
] as const;

const L2_CHAINS_TESTNETS = [
  {
    key: 'op-sepolia',
    name: 'OP Sepolia',
    id: 11155420,
  },
  {
    key: 'worldchain-sepolia',
    name: 'Worldchain Sepolia',
    id: 4801,
  },
  {
    key: 'base-sepolia',
    name: 'Base Sepolia',
    id: 84532,
  },
] as const;

const L2_CHAINS_MAINNETS = [
  {
    key: 'op',
    name: 'OP Mainnet',
    id: 10,
  },
] as const;

export const L1_CHAINS = [...L1_CHAINS_TESTNETS];

export const L2_CHAINS = [...L2_CHAINS_TESTNETS];

export const CHAINS = [...L1_CHAINS, ...L2_CHAINS] as const;
