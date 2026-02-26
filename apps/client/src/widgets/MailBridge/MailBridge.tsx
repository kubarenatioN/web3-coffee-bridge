import MailBridgeChainsSelect from '@/features/MailBridgeChainsSelect/MailBridgeChainsSelect';
import MailBridgeFee from '@/features/MailBridgeFee/MailBridgeFee';
import MailBridgeInput from '@/features/MailBridgeInput/MailBridgeInput';
import MailBridgeSubmit from '@/features/MailBridgeSubmit/MailBridgeSubmit';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import MailBridgeHistory from '../MailBridgeHistory/MailBridgeHistory';

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
        <MailBridgeInput />

        <Box maxWidth={'310px'} width={'100%'}>
          <MailBridgeSubmit />
        </Box>

        <Flex direction={'column'} width={'100%'} maxWidth={'400px'}>
          <MailBridgeFee />
        </Flex>
      </Flex>

      <MailBridgeHistory />
    </Flex>
  );
}

export default MailBridge;
