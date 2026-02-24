import { create } from 'zustand';
import { getChainsPair } from '../helpers/chain.helper';
import type { ChainType } from '../types/chains.types';

export interface MailBridgeStore {
  sourceChain: ChainType;
  destinationChain: ChainType;
  message: string;
  feeAmount: string;
  feePending: boolean;
  setChain: (data: { type: 'source' | 'dest'; value: ChainType }) => void;
  setMessage: (message: string) => void;
  setFeeAmount: (amount: string) => void;
  setFeePending: (pending: boolean) => void;
  setFeeState: (feeAmount: string, feePending: boolean) => void;
}

export const useMailBridgeStore = create<MailBridgeStore>((set) => {
  return {
    sourceChain: 'ethereum-sepolia',
    destinationChain: 'op-sepolia',
    message: '',
    feeAmount: '',
    feePending: false,
    setChain: ({ type, value }) => {
      set((state) => {
        const { sourceChain, destinationChain } = getChainsPair(
          type,
          value,
          state,
        );
        return { sourceChain, destinationChain };
      });
    },
    setMessage: (message) => set({ message }),
    setFeeAmount: (val) => set({ feeAmount: val }),
    setFeePending: (val) => set({ feePending: val }),
    setFeeState: (feeAmount, feePending) => set({ feeAmount, feePending }),
  };
});
