import TokenBridgeChainsSelect from '@/features/TokenBridgeChainsSelect/TokenBridgeChainsSelect';
import TokenBridgeFee from '@/features/TokenBridgeFee/TokenBridgeFee';
import TokenBridgeSubmit from '@/features/TokenBridgeSubmit/TokenBridgeSubmit';
import TokenInput from '@/features/TokenInput/TokenInput';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';

function TokenBridge() {
  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex direction={'column'}>
        <Heading as='h2'>Token Bridge</Heading>
        <Text>Choose source and destination chains and make a transfer</Text>
      </Flex>

      <TokenBridgeChainsSelect />

      <Flex direction='column' align={'center'} gap={'2'}>
        <TokenInput />

        <Box maxWidth={'310px'} width={'100%'}>
          <TokenBridgeSubmit />
        </Box>

        <Flex direction={'column'} width={'100%'} maxWidth={'400px'}>
          <TokenBridgeFee />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default TokenBridge;
