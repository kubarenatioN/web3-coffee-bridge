import { L1_COFFEE_MAILBOX_ABI } from '@/contracts/abi/L1Mailbox.abi';
import { CHAINS } from '@/shared/config/chains';
import { mailboxAddressSelector } from '@/shared/store/mailboxStoreSelectors';
import { useMailBridgeStore } from '@/shared/store/useMailBridgeStore';
import { config } from '@/wagmi.config';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { encodeFunctionData, formatEther } from 'viem';
import { useConnection } from 'wagmi';
import { estimateFeesPerGas, estimateGas } from 'wagmi/actions';

export function useMailBridgeFee() {
  const sourceChain = useMailBridgeStore((s) => s.sourceChain);
  const destinationChain = useMailBridgeStore((s) => s.destinationChain);
  const message = useMailBridgeStore((s) => s.message);
  const setFeeState = useMailBridgeStore((s) => s.setFeeState);

  const connection = useConnection();

  const bridgeAddress = useMailBridgeStore(mailboxAddressSelector);

  const sourceChainFull = CHAINS.find((c) => c.key === sourceChain);

  const [messageDebounced] = useDebounce(message, 500);

  const isConnected = connection.status === 'connected';

  useEffect(() => {
    let stale = false;

    const calculateFees = async () => {
      setFeeState('', false);

      if (!bridgeAddress || !messageDebounced || !sourceChainFull) {
        return;
      }

      const sourceChainId = sourceChainFull?.id;

      const _message = messageDebounced;

      setFeeState('', true);

      try {
        const gasBridge = await estimateGas(config, {
          to: bridgeAddress,
          data: encodeFunctionData({
            abi: L1_COFFEE_MAILBOX_ABI,
            functionName: 'sendMessage',
            args: [_message],
          }),
          chainId: sourceChainId,
        });

        const fees = await estimateFeesPerGas(config, {
          chainId: sourceChainId,
        });

        const feeValueWei = formatEther(fees.maxFeePerGas * gasBridge);

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
  }, [sourceChain, destinationChain, messageDebounced, isConnected]);
}
