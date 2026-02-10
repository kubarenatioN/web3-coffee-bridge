import WalletConnectBtn from '@/features/WalletConnectBtn/WalletConnectBtn';
import { Flex, Heading } from '@radix-ui/themes';

function Header() {
  return (
    <Flex justify={'between'} align={'center'}>
      <Heading
        size={{
          initial: '4',
          xs: '6',
        }}
      >
        Coffee Bridge
      </Heading>

      <WalletConnectBtn />
    </Flex>
  );
}

export default Header;
