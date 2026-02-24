import { IERC20_ABI } from '@/contracts/abi/IERC20.abi';
import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { CHAINS } from '@/shared/config/chains';
import { getTokenBridgeAddresses } from '@/shared/helpers/token-bridge.helpers';
import { bridgeAddressSelector } from '@/shared/store/tokenBridgeStoreSelectors';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { config } from '@/wagmi.config';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { encodeFunctionData, formatEther, parseEther } from 'viem';
import { useConnection } from 'wagmi';
import { estimateFeesPerGas, estimateGas } from 'wagmi/actions';

export function useTokenBridgeFee() {
  const sourceChain = useTokenBridgeStore((s) => s.sourceChain);
  const destinationChain = useTokenBridgeStore((s) => s.destinationChain);
  const selectedToken = useTokenBridgeStore((s) => s.token);
  const tokenAmount = useTokenBridgeStore((s) => s.tokenAmount);
  const setFeeState = useTokenBridgeStore((s) => s.setFeeState);

  const connection = useConnection();

  const bridgeAddress = useTokenBridgeStore(bridgeAddressSelector);

  const sourceChainFull = CHAINS.find((c) => c.key === sourceChain);

  const [tokenAmountDebounced] = useDebounce(tokenAmount, 500);

  const isConnected = connection.status === 'connected';

  useEffect(() => {
    let stale = false;

    const calculateFees = async () => {
      setFeeState('', false);

      let amountWei = 0n;

      if (!Number.isNaN(tokenAmountDebounced)) {
        amountWei = parseEther(tokenAmountDebounced);
      }

      if (!bridgeAddress || !amountWei || !sourceChainFull) {
        return;
      }

      const sourceChainId = sourceChainFull?.id;

      const tokenAddresses = getTokenBridgeAddresses(
        selectedToken,
        sourceChain,
        destinationChain,
      );

      if (!tokenAddresses) {
        return;
      }

      const { l1Address, l2Address, localAddress } = tokenAddresses;

      if (!l1Address || !l2Address || !localAddress) {
        return;
      }

      setFeeState('', true);

      try {
        const gasERC20Approve = await estimateGas(config, {
          to: localAddress as `0x${string}`,
          data: encodeFunctionData({
            abi: IERC20_ABI,
            functionName: 'approve',
            args: [bridgeAddress, amountWei],
          }),
          chainId: sourceChainId,
        });

        const gasBridge = await estimateGas(config, {
          to: bridgeAddress,
          data: encodeFunctionData({
            abi: L1_STANDARD_BRIDGE_ABI,
            functionName: 'bridgeERC20',
            args: [l1Address, l2Address, 0n, 210_000, '0x'],
          }),
          chainId: sourceChainId,
        });

        const fees = await estimateFeesPerGas(config, {
          chainId: sourceChainId,
        });

        const feeValueWei = formatEther(
          fees.maxFeePerGas * (gasERC20Approve + gasBridge),
        );

        if (stale) {
          return;
        }

        setFeeState(feeValueWei, false);
      } catch (error) {
        console.error('Fee estimation error', error);
        setFeeState('', false);
      }
    };

    if (isConnected) {
      calculateFees();
    }

    return () => {
      stale = true;
    };
  }, [
    tokenAmountDebounced,
    selectedToken,
    sourceChain,
    destinationChain,
    isConnected,
  ]);
}
