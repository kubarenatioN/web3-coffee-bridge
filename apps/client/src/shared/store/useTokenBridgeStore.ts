import { create } from 'zustand';
import type { ChainType } from '../types/chains.types';

interface TokenBridgeStore {
  sourceChain: ChainType;
  destinationChain: ChainType;
  token: string;
  tokenAmount: string;
  feeAmount: string;
  feePending: boolean;
  setChain: (data: { type: 'source' | 'dest'; value: ChainType }) => void;
  setToken: (token: string) => void;
  setTokenAmount: (amount: string) => void;
  setFeeAmount: (amount: string) => void;
  setFeePending: (pending: boolean) => void;
  setFeeState: (feeAmount: string, feePending: boolean) => void;
}

const DEFAULT_TOKEN = 'Coffee Token';

export const useTokenBridgeStore = create<TokenBridgeStore>((set) => {
  return {
    sourceChain: 'ethereum-sepolia',
    destinationChain: 'op-sepolia',
    token: DEFAULT_TOKEN,
    tokenAmount: '',
    feeAmount: '',
    feePending: false,
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
            return {
              destinationChain: value,
              sourceChain: state.destinationChain,
            };
          } else {
            return { destinationChain: value };
          }
        }
      });
    },
    setToken: (token) => set({ token }),
    setTokenAmount: (val) => set({ tokenAmount: val }),
    setFeeAmount: (val) => set({ feeAmount: val }),
    setFeePending: (val) => set({ feePending: val }),
    setFeeState: (feeAmount, feePending) => set({ feeAmount, feePending }),
  };
});
