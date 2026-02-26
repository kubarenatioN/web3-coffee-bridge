import type { ChainType } from '@/shared/types/chains.types';
import type { Address } from 'viem';

const L1_STANDARD_BRIDGE_OP_SEPOLIA =
  '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1';
const L1_STANDARD_BRIDGE_BASE_SEPOLIA =
  '0xfd0Bf71F60660E2f608ed56e1659C450eB113120';
const L1_STANDARD_BRIDGE_WORLDCHAIN_SEPOLIA =
  '0xd7DF54b3989855eb66497301a4aAEc33Dbb3F8DE';

const L2_STANDARD_BRIDGE = '0x4200000000000000000000000000000000000010';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SUPERCHAIN_BRIDGE = '0x4200000000000000000000000000000000000028';

export const STANDARD_BRIDGE_ADDRESS: {
  [key in ChainType]: Partial<{
    [key in ChainType]: Address;
  }>;
} = {
  'ethereum-sepolia': {
    'op-sepolia': L1_STANDARD_BRIDGE_OP_SEPOLIA,
    'base-sepolia': L1_STANDARD_BRIDGE_BASE_SEPOLIA,
    'worldchain-sepolia': L1_STANDARD_BRIDGE_WORLDCHAIN_SEPOLIA,
  },
  'op-sepolia': {
    'ethereum-sepolia': L2_STANDARD_BRIDGE,
  },
  'base-sepolia': {
    'ethereum-sepolia': L2_STANDARD_BRIDGE,
  },
  'worldchain-sepolia': {
    'ethereum-sepolia': L2_STANDARD_BRIDGE,
  },
} as const;

export const BRIDGE_ADDRESS_TO_CHAIN: {
  [key: Address]: ChainType;
} = Object.fromEntries(
  Object.entries({
    [L1_STANDARD_BRIDGE_OP_SEPOLIA]: 'op-sepolia',
    [L1_STANDARD_BRIDGE_BASE_SEPOLIA]: 'base-sepolia',
    [L1_STANDARD_BRIDGE_WORLDCHAIN_SEPOLIA]: 'worldchain-sepolia',
  }).map(([key, value]) => [key.toLowerCase() as Address, value as ChainType]),
);
