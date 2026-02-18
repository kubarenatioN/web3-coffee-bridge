import { BRIDGE_TOKENS_MAP } from '../config/tokens';
import type { ChainType } from '../types/chains.types';
import { isL1Chain } from './chain.helper';

export function getTokenBridgeAddresses(
  token: string,
  sourceChain: ChainType,
  destinationChain: ChainType,
) {
  const tokenChains = BRIDGE_TOKENS_MAP.get(token)?.tokens;

  if (!tokenChains) {
    return;
  }

  const isSourceChainL1 = isL1Chain(sourceChain);

  const sourceAddress = isSourceChainL1
    ? tokenChains[sourceChain]?.address
    : tokenChains[destinationChain]?.address;
  const targetAddress = isSourceChainL1
    ? tokenChains[destinationChain]?.address
    : tokenChains[sourceChain]?.address;

  const l1Address = isSourceChainL1 ? sourceAddress : targetAddress;
  const l2Address = isSourceChainL1 ? targetAddress : sourceAddress;

  const localAddress = isL1Chain(sourceChain) ? l1Address : l2Address;

  return {
    l1Address,
    l2Address,
    localAddress,
  };
}
