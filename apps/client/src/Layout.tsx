import { Box, Flex } from '@radix-ui/themes';
import { Outlet } from 'react-router';
import styles from './Layout.module.css';
import Header from './widgets/Header/Header';

function Layout() {
  return (
    <Flex direction={'column'} gap={'4'}>
      <Box py={'3'} px={'2'} className={styles.header_wrapper}>
        <Header />
      </Box>
      <Box px='2'>
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Layout;
