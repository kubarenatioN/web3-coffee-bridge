import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import { BridgeSelect } from '../BridgeSelect';

function TokenBridgeChainsSelect() {
  const sourceChain = useTokenBridgeStore((state) => state.sourceChain);
  const destinationChain = useTokenBridgeStore(
    (state) => state.destinationChain,
  );
  const setChain = useTokenBridgeStore((state) => state.setChain);

  return (
    <BridgeSelect
      sourceChain={sourceChain}
      destinationChain={destinationChain}
      onChange={setChain}
    />
  );
}

export default TokenBridgeChainsSelect;
