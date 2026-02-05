import BridgeSelect from '@/features/BridgeSelect/BridgeSelect';
import { BRIDGE_TOKENS, BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { InputHelpers } from '@/shared/helpers/input.helpers';
import { Box, Button, Dialog, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { Delete } from 'lucide-react';
import { useCallback, useState } from 'react';
import styles from './TokenBridge.module.css';

function TokenBridge() {
  const [selectTokenDialogOpen, setSelectTokenDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>(BRIDGE_TOKENS[0].key);
  const [amount, setAmount] = useState<string>('');

  const handleAmountChange = useCallback(
    (value: string) => {
      const result = InputHelpers.formatNumericInput(value);

      if (typeof result === 'string') {
        setAmount(result);
      }
    },
    [setAmount]
  );

  const formatAmountOnBlur = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }
      if (value === '.') {
        setAmount('0');
      } else if (value.startsWith('.')) {
        setAmount(`0${value}`);
      } else if (value.endsWith('.')) {
        setAmount(`${value}0`);
      }
    },
    [setAmount]
  );

  const handleSendTokens = useCallback((amount: string, selectedToken: string) => {
    console.log(amount, selectedToken);
  }, []);

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
          initial: '310px',
          xs: '400px',
        }}
        width={'100%'}
      >
        <input type='text' />
        <TextField.Root
          placeholder='1.25'
          variant='soft'
          size='3'
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          onBlur={(e) => formatAmountOnBlur(e.target.value)}
        >
          <TextField.Slot side='right'>
            <Flex align={'center'} gap={'2'}>
              {!!amount && (
                <button
                  type='button'
                  onClick={() => setAmount('')}
                  className={`rt-BaseButton rt-reset btn-reset`}
                >
                  <Delete size={18} />
                </button>
              )}
              <Box minWidth={'60px'}>
                <Button
                  style={{
                    width: '100%',
                  }}
                  size='2'
                  variant='soft'
                  onClick={() => setSelectTokenDialogOpen(true)}
                >
                  {BRIDGE_TOKENS_MAP.get(selectedToken)?.symbol}
                </Button>
              </Box>
            </Flex>
          </TextField.Slot>
        </TextField.Root>
        <Text size='2' color='gray'>
          =$120.45
        </Text>
      </Flex>

      <Box alignSelf={'center'}>
        <Button size={'3'} onClick={() => handleSendTokens(amount, selectedToken)}>
          Send
        </Button>
      </Box>

      <Dialog.Root open={selectTokenDialogOpen} onOpenChange={setSelectTokenDialogOpen}>
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
                    setSelectTokenDialogOpen(false);
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
