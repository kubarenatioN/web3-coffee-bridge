import { IERC20_ABI } from '@/contracts/abi/IERC20.abi';
import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { STANDARD_BRIDGE_ADDRESS } from '@/contracts/config';
import { BridgeSelect, type ChainsSelection } from '@/features/BridgeSelect';
import { CHAINS } from '@/shared/config/chains';
import { BRIDGE_TOKENS, BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { isL1Chain } from '@/shared/helpers/chain.helper';
import { InputHelpers } from '@/shared/helpers/input.helpers';
import { config } from '@/wagmi.config';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  Inset,
  Spinner,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes';
import { Delete } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { encodeFunctionData, formatEther } from 'viem';
import { BaseError, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import { estimateFeesPerGas, estimateGas } from 'wagmi/actions';
import styles from './TokenBridge.module.css';

function TokenBridge() {
  const [selectTokenDialogOpen, setSelectTokenDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>(BRIDGE_TOKENS[0].name);
  const [selectedChains, setSelectedChains] = useState<ChainsSelection>({} as ChainsSelection);
  const [amount, setAmount] = useState<string>('');
  const writeContract = useWriteContract();

  const [feeState, setFeeState] = useState<{ value: string; isPending: boolean }>({
    value: '',
    isPending: false,
  });

  const sourceChain = CHAINS.find((c) => c.key === selectedChains.sourceChain);

  const bridgeAddress = sourceChain
    ? STANDARD_BRIDGE_ADDRESS?.[sourceChain.key]?.[selectedChains.destinationChain]
    : undefined;

  const amountWei = useMemo(() => {
    return amount ? BigInt(amount) * 10n ** 18n : 0n;
  }, [amount]);

  const [amountWeiDebounced] = useDebounce(amountWei, 500);

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

  useEffect(() => {
    const calculateFees = async () => {
      setFeeState({ isPending: false, value: '' });
      const _amount = amountWeiDebounced;

      if (!sourceChain || !bridgeAddress || !_amount) {
        return;
      }

      const txData = prepareBridgeTransactionData(selectedToken, selectedChains);
      if (!txData) {
        return;
      }

      const { l1Address, l2Address } = txData;

      if (!l1Address || !l2Address) {
        return;
      }

      setFeeState({ ...feeState, isPending: true });

      const localAddress = isL1Chain(sourceChain.key) ? l1Address : l2Address;

      const gasERC20Approve = await estimateGas(config, {
        to: localAddress as `0x${string}`,
        data: encodeFunctionData({
          abi: IERC20_ABI,
          functionName: 'approve',
          args: [bridgeAddress, amountWei],
        }),
        chainId: sourceChain.id,
      });

      const gasBridge = await estimateGas(config, {
        to: bridgeAddress,
        data: encodeFunctionData({
          abi: L1_STANDARD_BRIDGE_ABI,
          functionName: 'bridgeERC20',
          args: [l1Address, l2Address, 0n, 210_000, '0x'],
        }),
        chainId: sourceChain.id,
      });

      const fees = await estimateFeesPerGas(config, {
        chainId: sourceChain.id,
      });

      const feeValueWei = formatEther(fees.maxFeePerGas * (gasERC20Approve + gasBridge));

      // console.log(feeValueWei);

      setFeeState({ value: feeValueWei, isPending: false });
    };

    calculateFees();
  }, [amountWeiDebounced, sourceChain, selectedToken, bridgeAddress, selectedChains]);

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

  const submitBridge = async (token: string) => {
    const data = prepareBridgeTransactionData(token, selectedChains);
    if (!data) {
      return;
    }

    const { sourceChainId, l1Address, l2Address } = data;

    if (!l1Address || !l2Address) {
      toast.error('Token not found');
      return;
    }

    if (!isL1Chain(selectedChains.sourceChain) && !isL1Chain(selectedChains.destinationChain)) {
      toast.error('Cannot bridge between L2 chains (temporary)');
      return;
    }

    if (!bridgeAddress) {
      toast.error('Bridge contract not found for selected chains');
      return;
    }

    // switch the chain
    if (currentChainId !== sourceChainId) {
      await switchChain.mutateAsync({
        chainId: sourceChainId,
      });
    }

    const args = [l1Address, l2Address, amountWei, 210_000, '0x'];

    writeContractMutate(
      {
        address: bridgeAddress,
        abi: L1_STANDARD_BRIDGE_ABI,
        functionName: 'bridgeERC20',
        args,
      },
      {
        onSuccess: () => {
          toast.success('Transaction submitted', { autoClose: 3000 });
        },
      },
    );
  };

  function prepareBridgeTransactionData(token: string, selectedChains: ChainsSelection) {
    const tokenData = BRIDGE_TOKENS_MAP.get(token);
    const tokenChains = tokenData?.tokens;

    // if (!tokenChains) {
    //   toast.error('Token chains not found');
    //   return;
    // }

    const sourceChain = CHAINS.find((c) => c.key === selectedChains.sourceChain);
    const destinationChain = CHAINS.find((c) => c.key === selectedChains.destinationChain);

    if (!sourceChain || !destinationChain) {
      return;
    }

    const isSourceChainL1 = isL1Chain(sourceChain.key);

    // if (isSourceChainL1 && isDestinationChainL1) {
    //   toast.error('Cannot bridge between L1 chains');
    //   return;
    // }

    // if (!isSourceChainL1 && !isDestinationChainL1) {
    //   toast.error('Cannot bridge between L2 chains (temporary)');
    //   return;
    // }

    const sourceAddress = isSourceChainL1
      ? tokenChains?.[sourceChain.key]?.address
      : tokenChains?.[destinationChain.key]?.address;
    const targetAddress = isSourceChainL1
      ? tokenChains?.[destinationChain.key]?.address
      : tokenChains?.[sourceChain.key]?.address;

    // if (!sourceAddress || !targetAddress) {
    //   toast.error('Token not found');
    //   return;
    // }

    const l1Address = isSourceChainL1 ? sourceAddress : targetAddress;
    const l2Address = isSourceChainL1 ? targetAddress : sourceAddress;

    return {
      sourceChainId: sourceChain.id,
      l1Address,
      l2Address,
    };
  }

  const _selectedTokenData = BRIDGE_TOKENS_MAP.get(selectedToken);

  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex direction={'column'}>
        <Heading as='h2'>Token Bridge</Heading>
        <Text>Choose source and destination chains and make a transfer</Text>
      </Flex>

      <BridgeSelect onSelect={handleChainsSelect} />

      <Flex direction='column' align={'center'} gap={'2'}>
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
                      onClick={() => setAmount('')}
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
        </Box>

        <Box maxWidth={'310px'} width={'100%'}>
          <Box width={'100%'} asChild>
            <Button
              size={'3'}
              onClick={() => submitBridge(selectedToken)}
              disabled={writeContract.isPending}
            >
              {writeContract.isPending ? <Spinner /> : 'Send'}
            </Button>
          </Box>
        </Box>

        <Flex direction={'column'} gap={'1'} width={'100%'} maxWidth={'400px'}>
          <Flex justify={'between'} align={'center'} gap={'1'}>
            <Text size={'2'}>Estimated fee:</Text>

            {feeState.isPending ? (
              <Spinner />
            ) : !feeState.value ? (
              <Tooltip content={'No estimate'}>
                <Text size={'2'}>--</Text>
              </Tooltip>
            ) : (
              <Tooltip content={`≈ ${feeState.value.slice(0, 12)} ETH`}>
                <Text size={'2'}>≈ {Number(feeState.value).toFixed(4)} ETH</Text>
              </Tooltip>
            )}
          </Flex>
        </Flex>

        <Flex direction={'column'} height={'16px'} maxWidth={'310px'} width={'100%'}>
          {writeContract.error && (
            <Text size='2' color='red' trim='both'>
              {(writeContract.error as BaseError)?.shortMessage || writeContract.error.message}
            </Text>
          )}
        </Flex>
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
