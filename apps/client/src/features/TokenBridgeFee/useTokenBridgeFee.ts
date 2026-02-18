import { IERC20_ABI } from '@/contracts/abi/IERC20.abi';
import { L1_STANDARD_BRIDGE_ABI } from '@/contracts/abi/L1StandardBridge.abi';
import { CHAINS } from '@/shared/config/chains';
import { BRIDGE_TOKENS_MAP } from '@/shared/config/tokens';
import { isL1Chain } from '@/shared/helpers/chain.helper';
import { bridgeAddressSelector } from '@/shared/store/tokenBridgeStoreSelectors';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { config } from '@/wagmi.config';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { encodeFunctionData, formatEther } from 'viem';
import { estimateFeesPerGas, estimateGas } from 'wagmi/actions';

export function useTokenBridgeFee() {
  const sourceChain = useTokenBridgeStore((s) => s.sourceChain);
  const destinationChain = useTokenBridgeStore((s) => s.destinationChain);
  const selectedToken = useTokenBridgeStore((s) => s.token);
  const tokenAmount = useTokenBridgeStore((s) => s.tokenAmount);

  const setFeeState = useTokenBridgeStore((s) => s.setFeeState);

  const bridgeAddress = useTokenBridgeStore(bridgeAddressSelector);
  const sourceChainFull = CHAINS.find((c) => c.key === sourceChain);

  const amountWei = tokenAmount ? BigInt(tokenAmount) * 10n ** 18n : 0n;
  const [amountWeiDebounced] = useDebounce(amountWei, 500);

  useEffect(() => {
    let stale = false;

    const calculateFees = async () => {
      setFeeState('', false);

      const amount = amountWeiDebounced;

      if (!bridgeAddress || !amount || !sourceChainFull) {
        return;
      }

      const sourceChainId = sourceChainFull?.id;

      const tokenAddresses = _getTokenAddresses();

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

    calculateFees();

    return () => {
      stale = true;
    };
  }, [amountWeiDebounced, selectedToken, sourceChain, destinationChain]);

  function _getTokenAddresses() {
    const tokenChains = BRIDGE_TOKENS_MAP.get(selectedToken)?.tokens;

    if (!tokenChains) {
      return;
    }

    const isSourceChainL1 = isL1Chain(sourceChain);

    const sourceAddress = isSourceChainL1
      ? tokenChains[sourceChain]?.address
      : tokenChains[destinationChain]?.address;
    const targetAddress = isSourceChainL1
      ? tokenChains[destinationChain]?.address
      : tokenChains[sourceChain]?.address;

    const l1Address = isSourceChainL1 ? sourceAddress : targetAddress;
    const l2Address = isSourceChainL1 ? targetAddress : sourceAddress;

    const localAddress = isL1Chain(sourceChain) ? l1Address : l2Address;

    return {
      l1Address,
      l2Address,
      localAddress,
    };
  }
}
