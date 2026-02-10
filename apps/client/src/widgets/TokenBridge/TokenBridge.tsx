import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { STANDARD_BRIDGE_ADDRESS } from '@/contracts/config';
import { BridgeSelect, type ChainsSelection } from '@/features/BridgeSelect';
import { CHAINS } from '@/shared/config/chains';
import { BRIDGE_TOKENS, BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { isL1Chain } from '@/shared/helpers/chain.helper';
import { InputHelpers } from '@/shared/helpers/input.helpers';
import { Box, Button, Dialog, Flex, Heading, Inset, Text, TextField } from '@radix-ui/themes';
import { Delete } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BaseError, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import styles from './TokenBridge.module.css';

function TokenBridge() {
  const [selectTokenDialogOpen, setSelectTokenDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>(BRIDGE_TOKENS[0].name);
  const [selectedChains, setSelectedChains] = useState<ChainsSelection>({} as ChainsSelection);
  const [amount, setAmount] = useState<string>('');
  const writeContract = useWriteContract();

  const { mutate: writeContractMutate } = writeContract;

  const currentChainId = useChainId();
  const switchChain = useSwitchChain();

  useEffect(
    () => {
      if (writeContract.error) {
        writeContract.reset();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, selectedChains, selectedToken],
  );

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

  const handleChainsSelect = useCallback((data: ChainsSelection) => {
    setSelectedChains(data);
  }, []);

  const submitBridge = async (amount: string, token: string) => {
    const tokenData = BRIDGE_TOKENS_MAP.get(token);
    const tokenChains = tokenData?.tokens;

    if (!tokenChains) {
      toast.error('Token chains not found');
      return;
    }

    const sourceChain = CHAINS.find((c) => c.key === selectedChains.sourceChain);
    const destinationChain = CHAINS.find((c) => c.key === selectedChains.destinationChain);

    if (!sourceChain || !destinationChain) {
      toast.error('Chain not found');
      return;
    }

    const isSourceChainL1 = isL1Chain(sourceChain.key);
    const isDestinationChainL1 = isL1Chain(destinationChain.key);

    if (isSourceChainL1 && isDestinationChainL1) {
      toast.error('Cannot bridge between L1 chains');
      return;
    }

    if (!isSourceChainL1 && !isDestinationChainL1) {
      toast.error('Cannot bridge between L2 chains (temporary)');
      return;
    }

    const sourceAddress = isSourceChainL1
      ? tokenChains[sourceChain.key]?.address
      : tokenChains[destinationChain.key]?.address;
    const targetAddress = isSourceChainL1
      ? tokenChains?.[destinationChain.key]?.address
      : tokenChains?.[sourceChain.key]?.address;

    if (!sourceAddress || !targetAddress) {
      toast.error('Token not found');
      return;
    }

    const l1Address = isSourceChainL1 ? sourceAddress : targetAddress;
    const l2Address = isSourceChainL1 ? targetAddress : sourceAddress;
    const bridgeAddress = STANDARD_BRIDGE_ADDRESS?.[sourceChain.key]?.[destinationChain.key];

    if (!bridgeAddress) {
      toast.error('Bridge address not found');
      return;
    }

    // switch the chain
    if (currentChainId !== sourceChain.id) {
      await switchChain.mutateAsync({
        chainId: sourceChain.id,
      });
    }

    const amountWei = BigInt(amount) * 10n ** 18n;

    writeContractMutate(
      {
        address: bridgeAddress,
        abi: L1_STANDARD_BRIDGE_ABI,
        functionName: 'bridgeERC20',
        args: [l1Address, l2Address, amountWei, 21_000, '0x'],
      },
      {
        onSuccess: () => {
          toast.success('Transaction submitted', { autoClose: 3000 });
        },
      },
    );
  };

  const _selectedTokenData = BRIDGE_TOKENS_MAP.get(selectedToken);

  return (
    <Flex direction={'column'} gap={'6'}>
      <Flex direction={'column'}>
        <Heading as='h2'>Token Bridge</Heading>
        <Text>Choose source and destination chains and make a transfer</Text>
      </Flex>

      <BridgeSelect onSelect={handleChainsSelect} />

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

        <Flex direction={'column'} alignSelf={'start'} height={'20px'} mt={'1'}>
          {writeContract.error && (
            <Text size='2' color='red'>
              Error:{' '}
              {(writeContract.error as BaseError)?.shortMessage || writeContract.error.message}
            </Text>
          )}
        </Flex>

        <Box alignSelf={'center'} pt={'1'}>
          <Button size={'3'} onClick={() => submitBridge(amount, selectedToken)}>
            Send
          </Button>
        </Box>
      </Flex>

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
