import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { CHAINS } from '@/shared/config/chains';
import { isL1Chain } from '@/shared/helpers/chain.helper';
import { getTokenBridgeAddresses } from '@/shared/helpers/token-bridge.helpers';
import { bridgeAddressSelector } from '@/shared/store/tokenBridgeStoreSelectors';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { Box, Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { BaseError, parseEther } from 'viem';
import {
  useChainId,
  useConnection,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';

function TokenBridgeSubmit() {
  const sourceChain = useTokenBridgeStore((state) => state.sourceChain);
  const destinationChain = useTokenBridgeStore(
    (state) => state.destinationChain,
  );
  const amount = useTokenBridgeStore((state) => state.tokenAmount);
  const bridgeAddress = useTokenBridgeStore(bridgeAddressSelector);
  const selectedToken = useTokenBridgeStore((state) => state.token);

  const writeContract = useWriteContract();

  const connection = useConnection();
  const currentChainId = useChainId();
  const switchChain = useSwitchChain();

  const { mutate: writeContractMutate } = writeContract;

  const sourceChainFull = CHAINS.find((c) => c.key === sourceChain);

  useEffect(
    () => {
      if (writeContract.error) {
        writeContract.reset();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceChain, destinationChain, selectedToken, amount],
  );

  const submitBridge = async () => {
    const addresses = getTokenBridgeAddresses(
      selectedToken,
      sourceChain,
      destinationChain,
    );

    if (!addresses || !sourceChainFull) {
      return;
    }

    const { l1Address, l2Address } = addresses;

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
    if (currentChainId !== sourceChainFull.id) {
      await switchChain.mutateAsync({
        chainId: sourceChainFull.id,
      });
    }

    const args = [l1Address, l2Address, parseEther(amount), 210_000, '0x'];

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

  const connected = connection.status === 'connected';

  return (
    <Flex direction={'column'}>
      <Box width={'100%'} asChild>
        <Button
          size={'3'}
          onClick={() => submitBridge()}
          disabled={writeContract.isPending || !connected}
        >
          {writeContract.isPending ? <Spinner /> : 'Send'}
        </Button>
      </Box>

      <Flex direction={'column'} height={'16px'} width={'100%'} mt={'1'}>
        {writeContract.error && (
          <Text size='2' color='red' trim='both'>
            {(writeContract.error as BaseError)?.shortMessage ||
              writeContract.error.message}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

export default TokenBridgeSubmit;
