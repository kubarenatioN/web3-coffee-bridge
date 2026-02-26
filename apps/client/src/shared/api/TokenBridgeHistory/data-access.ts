import { gql } from 'graphql-request';
import { client } from '../gql-config';
import type { TokenBridgeHistoryResponse } from './models';

const TOKEN_BRIDGE_HISTORY_QUERY = gql`
  query TokensBridgeHistory($user: Bytes!, $size: Int! = 15, $skip: Int! = 0) {
    erc20BridgeInitiateds(
      where: { from: $user }
      orderBy: blockTimestamp
      orderDirection: desc
      first: $size
      skip: $skip
    ) {
      id
      from
      to
      remoteToken
      localToken
      bridgeAddress
      amount
      transactionHash
      blockTimestamp
      blockNumber
      extraData
    }
  }
`;

export function fetchTokenBridgeHistory(
  user: string,
  pagination: { size: number; skip: number },
) {
  return client.request<TokenBridgeHistoryResponse>(
    TOKEN_BRIDGE_HISTORY_QUERY,
    {
      user: user.toLowerCase(),
      size: pagination.size,
      skip: pagination.skip,
    },
  );
}
