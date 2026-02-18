import { STANDARD_BRIDGE_ADDRESS } from '@/contracts/config';
import type { TokenBridgeStore } from './useTokenBridgeStore';

export const bridgeAddressSelector = (state: TokenBridgeStore) => {
  const { sourceChain, destinationChain } = state;

  const bridgeAddress =
    STANDARD_BRIDGE_ADDRESS?.[sourceChain]?.[destinationChain];

  return bridgeAddress;
};
