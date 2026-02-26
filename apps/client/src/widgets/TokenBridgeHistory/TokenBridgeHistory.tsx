import TokenBridgeHistoryTable from '@/features/TokenBridgeHistoryTable';
import { useTokenBridgeHistory } from '@/features/TokenBridgeHistoryTable/useTokenBridgeHistory';
import { Box, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { useConnection } from 'wagmi';

function TokenBridgeHistory() {
  const connection = useConnection();
  const user = connection.address;

  const { data, isLoading } = useTokenBridgeHistory(user, 0, 10);

  const records = data?.erc20BridgeInitiateds ?? [];

  return (
    <Flex
      direction={'column'}
      gap={'3'}
      pb={'6'}
      pt={'4'}
      style={{
        borderTop: '1px solid var(--gray-a8)',
      }}
    >
      <Box>
        <Heading size={'5'} as='h2'>
          Recent transactions
        </Heading>
        <Text>Your recent operations are show here</Text>
      </Box>

      <Flex>
        {!isLoading && records.length > 0 && (
          <TokenBridgeHistoryTable data={records} />
        )}
        {!isLoading && records.length === 0 && (
          <Flex
            width={'100%'}
            direction={'column'}
            align={'center'}
            justify={'center'}
            gap={'1'}
            minHeight={'200px'}
          >
            <Text>No transactions found</Text>
          </Flex>
        )}
        {isLoading && (
          <Flex
            width={'100%'}
            direction={'column'}
            align={'center'}
            justify={'center'}
            gap={'1'}
            minHeight={'200px'}
          >
            <Spinner size={'3'} />
            <Text size={'4'}>Loading data...</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default TokenBridgeHistory;
