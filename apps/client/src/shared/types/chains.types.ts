import type { L1_CHAINS, L2_CHAINS } from '../config/chains';

export type L1ChainType = (typeof L1_CHAINS)[number]['key'];

export type L2ChainType = (typeof L2_CHAINS)[number]['key'];

export type ChainType = L1ChainType | L2ChainType;

export interface Chain {
  key: ChainType;
  name: string;
}
