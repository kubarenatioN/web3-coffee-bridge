import { BRIDGE_TOKENS, BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { InputHelpers } from '@/shared/helpers/input.helpers';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Inset,
  Text,
  TextField,
} from '@radix-ui/themes';
import { Delete } from 'lucide-react';
import { memo, useState } from 'react';
import styles from './TokenInput.module.css';

function TokenInput() {
  const [selectTokenDialogOpen, setSelectTokenDialogOpen] = useState(false);
  const selectedToken = useTokenBridgeStore((state) => state.token);
  const setToken = useTokenBridgeStore((state) => state.setToken);
  const setTokenAmount = useTokenBridgeStore((state) => state.setTokenAmount);
  const amount = useTokenBridgeStore((state) => state.tokenAmount);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result = InputHelpers.formatNumericInput(value);

    if (typeof result === 'string') {
      setTokenAmount(result);
    }
  };

  const formatAmountOnBlur = (
    e: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    const value = e.target.value;

    if (!value) {
      return;
    }
    if (value === '.') {
      setTokenAmount('0');
    } else if (value.startsWith('.')) {
      setTokenAmount(`0${value}`);
    } else if (value.endsWith('.')) {
      setTokenAmount(`${value}0`);
    }
  };

  const _selectedTokenData = BRIDGE_TOKENS_MAP.get(selectedToken);

  return (
    <Box
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
              <Box asChild width={'24px'} height={'24px'} p={'0'}>
                <Button
                  size={'1'}
                  type='button'
                  variant='soft'
                  onClick={() => setTokenAmount('')}
                  radius='full'
                >
                  <Delete size={18} />
                </Button>
              </Box>
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

      <Dialog.Root
        open={selectTokenDialogOpen}
        onOpenChange={setSelectTokenDialogOpen}
      >
        <Dialog.Content maxWidth={'480px'}>
          <Dialog.Title mb={'2'}>Select a token</Dialog.Title>
          <Dialog.Description>
            Select a token you want to bridge
          </Dialog.Description>

          <Inset mt={'4'} side={'x'}>
            <Flex direction={'column'} px={'1'}>
              {BRIDGE_TOKENS.map((t) => {
                return (
                  <Flex
                    className={styles['token-item']}
                    key={t.name}
                    onClick={() => {
                      setSelectTokenDialogOpen(false);
                      setToken(t.name);
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
    </Box>
  );
}

export default memo(TokenInput);
