import MailBridgeChainsSelect from '@/features/MailBridgeChainsSelect/MailBridgeChainsSelect';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';

function MailBridge() {
  return (
    <Flex direction={'column'} gap={'4'}>
      <Flex direction={'column'}>
        <Heading as='h2'>Mailbox</Heading>
        <Text>
          Choose source and destination chains and send a mail to a recipient
        </Text>
      </Flex>

      <MailBridgeChainsSelect />

      <Flex direction='column' align={'center'} gap={'2'}>
        {/* <TokenInput /> */}

        <Box maxWidth={'310px'} width={'100%'}>
          {/* <TokenBridgeSubmit /> */}
        </Box>

        <Flex direction={'column'} width={'100%'} maxWidth={'400px'}>
          {/* <TokenBridgeFee /> */}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default MailBridge;
