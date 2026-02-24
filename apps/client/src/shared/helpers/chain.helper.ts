import { L1_CHAINS } from '../config/chains';
import type { ChainType } from '../types/chains.types';

export const isL1Chain = (chain: ChainType) => {
  return L1_CHAINS.findIndex((c) => c.key === chain) >= 0;
};

export const isL2Chain = (chain: ChainType) => {
  return !isL1Chain(chain);
};

export function getChainsPair(
  type: 'source' | 'dest',
  value: ChainType,
  current: { sourceChain: ChainType; destinationChain: ChainType },
): { sourceChain: ChainType; destinationChain: ChainType } {
  if (type === 'source') {
    if (value === current.destinationChain) {
      return { sourceChain: value, destinationChain: current.sourceChain };
    } else {
      return { sourceChain: value, destinationChain: current.destinationChain };
    }
  } else {
    if (value === current.sourceChain) {
      return {
        destinationChain: value,
        sourceChain: current.destinationChain,
      };
    } else {
      return { destinationChain: value, sourceChain: current.sourceChain };
    }
  }
}
