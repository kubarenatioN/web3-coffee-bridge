import { L1_COFFEE_MAILBOX_ABI } from '@/contracts/abi/L1Mailbox.abi';
import { CHAINS } from '@/shared/config/chains';
import { mailboxAddressSelector } from '@/shared/store/mailboxStoreSelectors';
import { useMailBridgeStore } from '@/shared/store/useMailBridgeStore';
import { Box, Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  BaseError,
  useChainId,
  useConnection,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';

function MailBridgeSubmit() {
  const sourceChain = useMailBridgeStore((state) => state.sourceChain);
  const destinationChain = useMailBridgeStore(
    (state) => state.destinationChain,
  );
  const message = useMailBridgeStore((state) => state.message);
  const mailboxAddress = useMailBridgeStore(mailboxAddressSelector);

  const connection = useConnection();
  const currentChainId = useChainId();
  const switchChain = useSwitchChain();

  const writeContract = useWriteContract();

  const sourceChainFull = CHAINS.find((c) => c.key === sourceChain);

  useEffect(
    () => {
      if (writeContract.error) {
        writeContract.reset();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceChain, destinationChain, message],
  );

  const submit = async () => {
    if (!sourceChainFull) {
      return;
    }

    const formattedMsg = message.trim();

    if (formattedMsg.length === 0) {
      toast.error('Message cannot be empty');
      return;
    }
    if (formattedMsg.length > 64) {
      toast.error('Message is too long, max is 64 characters');
      return;
    }

    if (currentChainId !== sourceChainFull.id) {
      await switchChain.mutateAsync({
        chainId: sourceChainFull.id,
      });
    }

    writeContract.mutate(
      {
        abi: L1_COFFEE_MAILBOX_ABI,
        address: mailboxAddress,
        functionName: 'sendMessage',
        args: [formattedMsg],
      },
      {
        onSuccess: () => {
          toast.success('Message sent!', { autoClose: 3000 });
        },
      },
    );
  };

  const connected = connection.status === 'connected';

  return (
    <Flex direction='column'>
      <Box width={'100%'} asChild>
        <Button
          size={'3'}
          onClick={() => submit()}
          disabled={writeContract.isPending || !connected}
        >
          {connected ? (
            writeContract.isPending ? (
              <Spinner />
            ) : (
              'Send message'
            )
          ) : (
            'Connect your wallet'
          )}
        </Button>
      </Box>

      <Flex direction={'column'} height={'16px'} width={'100%'} mt={'1'}>
        {writeContract.error && (
          <Text size='2' color='red' trim='both'>
            {(writeContract.error as BaseError)?.shortMessage ||
              writeContract.error.message}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

export default MailBridgeSubmit;
