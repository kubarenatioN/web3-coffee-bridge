import type { Address } from 'viem';

export interface TokenBridgeHistoryResponse {
  erc20BridgeInitiateds: TokenBridgeRecord[];
}

export interface TokenBridgeRecord {
  id: string;
  from: Address;
  to: Address;
  remoteToken: Address;
  localToken: Address;
  bridgeAddress: Address;
  amount: string;
  transactionHash: string;
  blockTimestamp: string;
  blockNumber: string;
  extraData: string;
}
