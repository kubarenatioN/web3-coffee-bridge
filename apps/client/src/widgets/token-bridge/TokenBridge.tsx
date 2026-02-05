import BridgeSelect from '@/features/BridgeSelect/BridgeSelect';
import { BRIDGE_TOKENS, BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { Box, Button, Dialog, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import styles from './TokenBridge.module.css';

function TokenBridge() {
  const [isSelectTokenDialogOpen, setIsSelectTokenDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>(BRIDGE_TOKENS[0].key);

  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex direction={'column'}>
        <Heading>Token Bridge</Heading>
        <Text>Choose source and destination chains and make a transfer</Text>
      </Flex>

      <BridgeSelect />

      <Flex
        direction='column'
        mx={'auto'}
        maxWidth={{
          initial: '280px',
          xs: '400px',
        }}
        width={'100%'}
      >
        <TextField.Root placeholder='0.1' type='number' variant='soft' size='3'>
          <TextField.Slot side='right'>
            <Button size='3' variant='ghost' onClick={() => setIsSelectTokenDialogOpen(true)}>
              <Box minWidth={'80px'}>{BRIDGE_TOKENS_MAP.get(selectedToken)?.symbol}</Box>
            </Button>
          </TextField.Slot>
        </TextField.Root>
        <Text size='2' color='gray'>
          =$120.45
        </Text>
      </Flex>

      <Dialog.Root open={isSelectTokenDialogOpen} onOpenChange={setIsSelectTokenDialogOpen}>
        <Dialog.Content maxWidth={'480px'}>
          <Dialog.Title mb={'2'}>Select a token</Dialog.Title>
          <Dialog.Description>Select a token you want to bridge</Dialog.Description>

          <Flex direction={'column'} gap={'2'} mt={'4'}>
            {BRIDGE_TOKENS.map((t) => {
              return (
                <Flex
                  className={styles['token-item']}
                  key={t.key}
                  onClick={() => {
                    setSelectedToken(t.key);
                    setIsSelectTokenDialogOpen(false);
                  }}
                  align={'center'}
                  gap={'1'}
                >
                  <Text weight={'medium'} size={'4'}>
                    {t.symbol}
                  </Text>
                  <Text size={'3'} color='gray'>
                    {t.name}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

export default TokenBridge;
