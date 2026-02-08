import BridgeSelect from '@/features/BridgeSelect/BridgeSelect';
import { BRIDGE_TOKENS, BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { InputHelpers } from '@/shared/helpers/input.helpers';
import { Box, Button, Dialog, Flex, Heading, Inset, Text, TextField } from '@radix-ui/themes';
import { Delete } from 'lucide-react';
import { useState } from 'react';
import styles from './TokenBridge.module.css';

function TokenBridge() {
  const [selectTokenDialogOpen, setSelectTokenDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>(BRIDGE_TOKENS[0].name);
  const [amount, setAmount] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result = InputHelpers.formatNumericInput(value);

    if (typeof result === 'string') {
      setAmount(result);
    }
  };

  const formatAmountOnBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = e.target.value;

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
  };

  const bridgeERC20 = (amount: string, token: string) => {
    console.log(amount, token);
  };

  const _selectedTokenData = BRIDGE_TOKENS_MAP.get(selectedToken);

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
        <TextField.Root
          placeholder='1.25'
          variant='soft'
          size='3'
          value={amount}
          name='amount'
          onChange={handleAmountChange}
          onBlur={formatAmountOnBlur}
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
                  <Flex asChild align={'center'} gap={'1'}>
                    <span>
                      <img
                        src={_selectedTokenData?.icon}
                        alt={_selectedTokenData?.name}
                        width={22}
                        height={22}
                        style={{
                          borderRadius: '50%',
                          backgroundColor: '#fff',
                        }}
                      />
                      {_selectedTokenData?.symbol}
                    </span>
                  </Flex>
                </Button>
              </Box>
            </Flex>
          </TextField.Slot>
        </TextField.Root>
        <Text size='1' color='gray'>
          =$120.45
        </Text>
      </Flex>

      <Box alignSelf={'center'}>
        <Button size={'3'} onClick={() => bridgeERC20(amount, selectedToken)}>
          Send
        </Button>
      </Box>

      <Dialog.Root open={selectTokenDialogOpen} onOpenChange={setSelectTokenDialogOpen}>
        <Dialog.Content maxWidth={'480px'}>
          <Dialog.Title mb={'2'}>Select a token</Dialog.Title>
          <Dialog.Description>Select a token you want to bridge</Dialog.Description>

          <Inset mt={'4'} side={'x'}>
            <Flex direction={'column'} px={'1'}>
              {BRIDGE_TOKENS.map((t) => {
                return (
                  <Flex
                    className={styles['token-item']}
                    key={t.name}
                    onClick={() => {
                      setSelectedToken(t.name);
                      setSelectTokenDialogOpen(false);
                    }}
                    align={'center'}
                    gap={'1'}
                  >
                    <img
                      style={{
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 2px 1px rgb(134 134 134 / 70%)',
                      }}
                      src={t.icon}
                      alt={t.name}
                      width={24}
                      height={24}
                    />
                    <Text weight={'medium'} size={'4'}>
                      {t.symbol}
                    </Text>
                    <Text size={'3'} color='gray' ml={'auto'}>
                      {t.name}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          </Inset>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

export default TokenBridge;
