import { create } from 'zustand';
import type { ChainType } from '../types/chains.types';

interface TokenBridgeStore {
  sourceChain: ChainType;
  destinationChain: ChainType;
  token: string;
  setChain: (data: { type: 'source' | 'dest'; value: ChainType }) => void;
  // setChains: (data: { sourceChain: ChainType; destinationChain: ChainType }) => void;
  // setSourceChain: (chain: ChainType) => void;
  // setDestinationChain: (chain: ChainType) => void;
}

const DEFAULT_TOKEN = 'Coffee Token';

export const useTokenBridgeStore = create<TokenBridgeStore>((set) => {
  return {
    sourceChain: 'ethereum-sepolia',
    destinationChain: 'op-sepolia',
    token: DEFAULT_TOKEN,
    setChain: ({ type, value }) => {
      set((state) => {
        if (type === 'source') {
          if (value === state.destinationChain) {
            return { sourceChain: value, destinationChain: state.sourceChain };
          } else {
            return { sourceChain: value };
          }
        } else {
          if (value === state.sourceChain) {
            return { destinationChain: value, sourceChain: state.destinationChain };
          } else {
            return { destinationChain: value };
          }
        }
      });
    },
  };
});
