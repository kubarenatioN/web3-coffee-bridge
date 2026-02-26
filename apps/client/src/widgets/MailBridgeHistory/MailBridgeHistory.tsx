import MailBridgeHistoryTable from '@/features/MailBridgeHistoryTable';
import { useMailBridgeHistory } from '@/features/MailBridgeHistoryTable/useMailBridgeHistory';
import { Box, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { useConnection } from 'wagmi';

function MailBridgeHistory() {
  const connection = useConnection();
  const user = connection.address;

  const { data, isLoading } = useMailBridgeHistory(user, 0, 10);

  const records = data?.sendMessageCalls ?? [];

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
          Recent messages
        </Heading>
        <Text>Your recent mail operations are shown here</Text>
      </Box>

      <Flex>
        {!isLoading && records.length > 0 && (
          <MailBridgeHistoryTable data={records} />
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
            <Text>No messages found</Text>
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

export default MailBridgeHistory;
