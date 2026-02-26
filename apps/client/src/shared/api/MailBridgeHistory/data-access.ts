import { gql } from 'graphql-request';
import { client } from '../gql-config';
import type { MailBridgeHistoryResponse } from './models';

const MAIL_BRIDGE_HISTORY_QUERY = gql`
  query MailBridgeHistory($user: Bytes!, $size: Int! = 15, $skip: Int! = 0) {
    sendMessageCalls(
      where: { from: $user }
      orderBy: blockTimestamp
      orderDirection: desc
      first: $size
      skip: $skip
    ) {
      id
      from
      message
      mailboxAddress
      chainId
      transactionHash
      blockTimestamp
      blockNumber
    }
  }
`;

export function fetchMailBridgeHistory(
  user: string,
  pagination: { size: number; skip: number },
) {
  return client.request<MailBridgeHistoryResponse>(
    MAIL_BRIDGE_HISTORY_QUERY,
    {
      user: user.toLowerCase(),
      size: pagination.size,
      skip: pagination.skip,
    },
  );
}
