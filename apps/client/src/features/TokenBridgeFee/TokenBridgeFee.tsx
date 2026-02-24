import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { Flex, Spinner, Text, Tooltip } from '@radix-ui/themes';
import { useTokenBridgeFee } from './useTokenBridgeFee';

function TokenBridgeFee() {
  useTokenBridgeFee();
  const value = useTokenBridgeStore((state) => state.feeAmount);
  const isPending = useTokenBridgeStore((state) => state.feePending);

  const feeFormatted = Number(value).toFixed(4);

  const isVeryLowValue = Number(value) < 0.0001;

  return (
    <Flex justify={'between'} align={'center'} gap={'1'}>
      <Text size={'2'}>Estimated fee:</Text>

      {isPending ? (
        <Spinner />
      ) : !value ? (
        <Tooltip content={'No estimate'}>
          <Text size={'2'}>--</Text>
        </Tooltip>
      ) : !isVeryLowValue ? (
        <Tooltip content={`≈ ${value.slice(0, 12)} ETH`}>
          <Text size={'2'}>≈ {feeFormatted} ETH</Text>
        </Tooltip>
      ) : (
        <Tooltip content={`≈ ${value.slice(0, 12)} ETH`}>
          <Text size={'2'}>less than 0.0001 ETH</Text>
        </Tooltip>
      )}
    </Flex>
  );
}

export default TokenBridgeFee;
