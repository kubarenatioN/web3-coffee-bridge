import { Button, Flex, Text } from '@radix-ui/themes';
import {
  injected,
  useConnect,
  useConnection,
  useConnectionEffect,
  useConnectors,
  useDisconnect,
} from 'wagmi';

function WalletConnectBtn() {
  const connection = useConnection();
  const disconnect = useDisconnect();
  const connect = useConnect();
  const connectors = useConnectors();

  const injectedConnector = connectors.find((connector) => connector.id === injected.type);

  useConnectionEffect({
    onConnect(data) {
      console.log('Connected!', data);
    },
  });

  const handleConnect = () => {
    if (injectedConnector) {
      connect.mutate({ connector: injectedConnector });
    }
  };

  const handleDisconnect = () => {
    disconnect.mutate();
  };

  if (connection.status === 'connected') {
    return (
      <Flex gap={'1'}>
        <Flex asChild direction={'column'}>
          <Text size={'1'} color='indigo'>
            <span>Network ID:</span>
            <span>{connection.chain?.id}</span>
          </Text>
        </Flex>
        <Button variant='outline' onClick={handleDisconnect}>
          {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
        </Button>
      </Flex>
    );
  }

  if (connection.status === 'connecting') {
    return <Button disabled>Connecting...</Button>;
  }

  return <Button onClick={handleConnect}>Connect Wallet</Button>;
}

export default WalletConnectBtn;
