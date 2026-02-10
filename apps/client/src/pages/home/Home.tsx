import MailBridge from '@/widgets/MailBridge/MailBridge';
import TokenBridge from '@/widgets/TokenBridge/TokenBridge';
import { Box, Container, Flex, Heading, RadioCards, Text } from '@radix-ui/themes';
import { useState } from 'react';

function Home() {
  const [mode, setMode] = useState('token');

  return (
    <Flex
      direction='column'
      gap={{
        initial: '2',
        md: '8',
      }}
    >
      <Container size='1'>
        <RadioCards.Root gap='2' size='1' columns='2' defaultValue={mode} onValueChange={setMode}>
          <RadioCards.Item value='token'>Tokens</RadioCards.Item>
          <RadioCards.Item value='mail'>Messages</RadioCards.Item>
        </RadioCards.Root>
      </Container>

      <Box>
        {mode === 'token' ? (
          <Flex direction={'column'} gap={'6'}>
            <TokenBridge />

            <Flex direction={'column'}>
              <Heading size={'5'} as='h2'>
                Recent transactions
              </Heading>
              <Text>View your recent transactions</Text>

              <Flex direction={'column'} gap={'2'}>
                {[1, 2].map((el) => {
                  return (
                    <Flex key={el} direction={'column'}>
                      <Text>Transaction #{el}</Text>
                      <Text>Amount: 13.00 COFFEE</Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex direction={'column'} gap={'6'}>
            <MailBridge />
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default Home;
