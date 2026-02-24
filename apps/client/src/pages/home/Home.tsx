import MailBridge from '@/widgets/MailBridge/MailBridge';
import TokenBridge from '@/widgets/TokenBridge/TokenBridge';
import { Box, Container, Flex, RadioCards } from '@radix-ui/themes';
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
        <RadioCards.Root
          gap='2'
          size='1'
          columns='2'
          defaultValue={mode}
          onValueChange={setMode}
        >
          <RadioCards.Item value='token'>Tokens</RadioCards.Item>
          <RadioCards.Item value='mail'>Messages</RadioCards.Item>
        </RadioCards.Root>
      </Container>

      <Box>{mode === 'token' ? <TokenBridge /> : <MailBridge />}</Box>
    </Flex>
  );
}

export default Home;
