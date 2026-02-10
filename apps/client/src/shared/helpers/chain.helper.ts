import { L1_CHAINS } from '../config/chains';
import type { ChainType } from '../types/chains.types';

export const isL1Chain = (chain: ChainType) => {
  return L1_CHAINS.findIndex((c) => c.key === chain) >= 0;
};

export const isL2Chain = (chain: ChainType) => {
  return !isL1Chain(chain);
};
