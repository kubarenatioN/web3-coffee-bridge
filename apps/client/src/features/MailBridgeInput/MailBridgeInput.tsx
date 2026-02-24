import { useMailBridgeStore } from '@/shared/store/useMailBridgeStore';
import { Flex, Text, TextArea } from '@radix-ui/themes';

function MailBridgeInput() {
  const message = useMailBridgeStore((state) => state.message);

  const setMessage = useMailBridgeStore((state) => state.setMessage);

  return (
    <Flex
      direction='column'
      width={'100%'}
      maxWidth={{
        xs: '420px',
      }}
    >
      <Text size={'1'} asChild style={{ paddingBottom: 4 }}>
        <label htmlFor='mailbox-input'>Message</label>
      </Text>
      <TextArea
        id='mailbox-input'
        name='mailbox-input'
        maxLength={64}
        rows={4}
        placeholder='Enter your message'
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
    </Flex>
  );
}

export default MailBridgeInput;
