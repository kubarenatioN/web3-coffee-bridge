import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { BridgeSelect, type ChainsSelection } from '@/features/BridgeSelect';
import TokenBridgeFee from '@/features/TokenBridgeFee/TokenBridgeFee';
import TokenInput from '@/features/TokenInput/TokenInput';
import { CHAINS } from '@/shared/config/chains';
import { BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { isL1Chain } from '@/shared/helpers/chain.helper';
import { bridgeAddressSelector } from '@/shared/store/tokenBridgeStoreSelectors';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { Box, Button, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { BaseError, useChainId, useSwitchChain, useWriteContract } from 'wagmi';

function TokenBridge() {
  const sourceChain = useTokenBridgeStore((state) => state.sourceChain);
  const destinationChain = useTokenBridgeStore(
    (state) => state.destinationChain,
  );
  const selectedToken = useTokenBridgeStore((state) => state.token);

  const writeContract = useWriteContract();

  const bridgeAddress = useTokenBridgeStore(bridgeAddressSelector);

  console.log(bridgeAddress);

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
    [sourceChain, destinationChain, selectedToken],
  );

  const submitBridge = async (token: string) => {
    const data = prepareBridgeTransactionData(token, {
      sourceChain,
      destinationChain,
    });
    if (!data) {
      return;
    }

    const { sourceChainId, l1Address, l2Address } = data;

    if (!l1Address || !l2Address) {
      toast.error('Token not found');
      return;
    }

    if (!isL1Chain(sourceChain) && !isL1Chain(destinationChain)) {
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

    const args = [l1Address, l2Address, parseEther('1'), 210_000, '0x'];

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

  function prepareBridgeTransactionData(
    token: string,
    selectedChains: ChainsSelection,
  ) {
    const tokenData = BRIDGE_TOKENS_MAP.get(token);
    const tokenChains = tokenData?.tokens;

    const sourceChain = CHAINS.find(
      (c) => c.key === selectedChains.sourceChain,
    );
    const destinationChain = CHAINS.find(
      (c) => c.key === selectedChains.destinationChain,
    );

    if (!sourceChain || !destinationChain) {
      return;
    }

    const isSourceChainL1 = isL1Chain(sourceChain.key);

    const sourceAddress = isSourceChainL1
      ? tokenChains?.[sourceChain.key]?.address
      : tokenChains?.[destinationChain.key]?.address;
    const targetAddress = isSourceChainL1
      ? tokenChains?.[destinationChain.key]?.address
      : tokenChains?.[sourceChain.key]?.address;

    const l1Address = isSourceChainL1 ? sourceAddress : targetAddress;
    const l2Address = isSourceChainL1 ? targetAddress : sourceAddress;

    return {
      sourceChainId: sourceChain.id,
      l1Address,
      l2Address,
    };
  }

  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex direction={'column'}>
        <Heading as='h2'>Token Bridge</Heading>
        <Text>Choose source and destination chains and make a transfer</Text>
      </Flex>

      <BridgeSelect />

      <Flex direction='column' align={'center'} gap={'2'}>
        <TokenInput />

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
          <TokenBridgeFee />
        </Flex>

        <Flex
          direction={'column'}
          height={'16px'}
          maxWidth={'310px'}
          width={'100%'}
        >
          {writeContract.error && (
            <Text size='2' color='red' trim='both'>
              {(writeContract.error as BaseError)?.shortMessage ||
                writeContract.error.message}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default TokenBridge;
