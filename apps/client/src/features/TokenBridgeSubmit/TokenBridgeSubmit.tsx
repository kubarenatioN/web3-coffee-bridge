import { IERC20_ABI } from '@/contracts/abi/IERC20.abi';
import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { CHAINS } from '@/shared/config/chains';
import { isL1Chain } from '@/shared/helpers/chain.helper';
import { getTokenBridgeAddresses } from '@/shared/helpers/token-bridge.helpers';
import { bridgeAddressSelector } from '@/shared/store/tokenBridgeStoreSelectors';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { config as wagmiConfig } from '@/wagmi.config';
import { Box, Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BaseError, parseEther } from 'viem';
import {
  useChainId,
  useConnection,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';

function TokenBridgeSubmit() {
  const sourceChain = useTokenBridgeStore((state) => state.sourceChain);
  const destinationChain = useTokenBridgeStore(
    (state) => state.destinationChain,
  );
  const amount = useTokenBridgeStore((state) => state.tokenAmount);
  const setAmount = useTokenBridgeStore((state) => state.setTokenAmount);
  const bridgeAddress = useTokenBridgeStore(bridgeAddressSelector);
  const selectedToken = useTokenBridgeStore((state) => state.token);

  const bridgeWrite = useWriteContract();
  const tokenWrite = useWriteContract();

  const connection = useConnection();
  const currentChainId = useChainId();
  const switchChain = useSwitchChain();

  const [approvalPending, setApprovalPending] = useState(false);

  const userAddress = connection.address;

  const tokenAddresses = getTokenBridgeAddresses(
    selectedToken,
    sourceChain,
    destinationChain,
  );

  const { localAddress, remoteAddress } = tokenAddresses ?? {};

  const sourceChainFull = CHAINS.find((c) => c.key === sourceChain);

  useEffect(
    () => {
      if (bridgeWrite.error) {
        bridgeWrite.reset();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceChain, destinationChain, selectedToken, amount, connection.address],
  );

  const submitBridge = async () => {
    if (!sourceChainFull || !amount || !userAddress) {
      return;
    }

    if (!localAddress || !remoteAddress) {
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

    const amountWei = parseEther(amount);

    const args = [localAddress, remoteAddress, amountWei, 210_000, '0x'];

    try {
      const currentAllowance = await readContract(wagmiConfig, {
        address: localAddress,
        abi: IERC20_ABI,
        functionName: 'allowance',
        args: [userAddress, bridgeAddress],
      });

      if (currentAllowance < amountWei) {
        setApprovalPending(true);
        const approveTxHash = await tokenWrite.mutateAsync({
          address: localAddress,
          abi: IERC20_ABI,
          functionName: 'approve',
          args: [bridgeAddress, amountWei],
        });

        await waitForTransactionReceipt(wagmiConfig, {
          hash: approveTxHash,
          confirmations: 1,
        });
      }

      bridgeWrite.mutate(
        {
          address: bridgeAddress,
          abi: L1_STANDARD_BRIDGE_ABI,
          functionName: 'bridgeERC20',
          args,
        },
        {
          onSuccess: () => {
            toast.success('Transaction submitted', { autoClose: 3000 });
            setAmount('');
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast.error(
        'Oops! Error appeared while processing your transaction. Please try again later.',
      );
    } finally {
      setApprovalPending(false);
    }
  };

  const connected = connection.status === 'connected';

  const bridgePending = bridgeWrite.isPending;
  const bridgeError = bridgeWrite.error;

  return (
    <Flex direction={'column'}>
      <Box width={'100%'} asChild>
        {!connected ? (
          <Button size={'3'} disabled>
            Connect your wallet
          </Button>
        ) : (
          <Button
            size={'3'}
            onClick={() => submitBridge()}
            disabled={bridgePending || approvalPending}
          >
            {bridgePending || approvalPending ? <Spinner /> : 'Submit'}
          </Button>
        )}
      </Box>

      <Flex direction={'column'} minHeight={'16px'} width={'100%'} mt={'1'}>
        {bridgeError && (
          <Text size='2' color='red' trim='both'>
            {(bridgeError as BaseError)?.shortMessage || bridgeError.message}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

export default TokenBridgeSubmit;
