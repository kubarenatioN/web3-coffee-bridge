import { useMailBridgeStore } from '@/shared/store/useMailBridgeStore';
import { BridgeSelect } from '../BridgeSelect';

function MailBridgeChainsSelect() {
  const sourceChain = useMailBridgeStore((state) => state.sourceChain);
  const destinationChain = useMailBridgeStore(
    (state) => state.destinationChain,
  );
  const setChain = useMailBridgeStore((state) => state.setChain);

  return (
    <BridgeSelect
      sourceChain={sourceChain}
      destinationChain={destinationChain}
      onChange={setChain}
    />
  );
}

export default MailBridgeChainsSelect;
