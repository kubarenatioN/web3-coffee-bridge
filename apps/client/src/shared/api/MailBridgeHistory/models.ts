import type { Address } from 'viem';

export interface MailBridgeHistoryResponse {
  sendMessageCalls: MailBridgeRecord[];
}

export interface MailBridgeRecord {
  id: string;
  from: Address;
  message: string;
  mailboxAddress: Address;
  chainId: number;
  transactionHash: string;
  blockTimestamp: string;
  blockNumber: string;
}
