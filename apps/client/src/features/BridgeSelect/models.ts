import type { ChainType } from '@/shared/types/chains.types';

export interface ChainsReducerState {
  sourceChain: ChainType;
  destinationChain: ChainType;
}
