import { Flex, Heading, Text } from '@radix-ui/themes';

function TokenBridgeHistory() {
  return (
    <Flex direction={'column'}>
      <Heading size={'5'} as='h2'>
        Recent transactions
      </Heading>
      <Text>View your recent transactions</Text>

      <Flex direction={'column'} gap={'2'}>
        {[1, 2, 3, 4].map((el) => {
          return (
            <Flex key={el} direction={'column'}>
              <Text>Transaction #{el}</Text>
              <Text>Amount: 13.00 COFFEE</Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default TokenBridgeHistory;
