import { CHAINS } from '@/shared/config/chains';
import { useTokenBridgeStore } from '@/shared/store/useTokenBridgeStore';
import type { ChainType } from '@/shared/types/chains.types';
import { Box, Flex, Grid, IconButton, Select, Text } from '@radix-ui/themes';
import { ArrowRightLeft } from 'lucide-react';
import { memo } from 'react';
import styles from './BridgeSelect.module.css';

const chainsMap = new Map(CHAINS.map((chain) => [chain.key, chain]));

function BridgeSelect() {
  const sourceChain = useTokenBridgeStore((state) => state.sourceChain);
  const destinationChain = useTokenBridgeStore((state) => state.destinationChain);
  const setChain = useTokenBridgeStore((state) => state.setChain);

  return (
    <Grid
      areas={{
        initial: '"source destination"',
        xs: '"source swap destination"',
      }}
      columns={{
        initial: 'repeat(2, minmax(0, 1fr))',
        xs: 'minmax(0, 1fr) min-content minmax(0, 1fr)',
      }}
      align={'center'}
      gap={'2'}
    >
      <Box gridArea={'source'}>
        <Text size={'1'} asChild>
          <label>Source chain</label>
        </Text>
        <Select.Root
          value={sourceChain}
          onValueChange={(val: ChainType) => {
            setChain({ type: 'source', value: val });
          }}
        >
          <Select.Trigger className={styles['select-trigger']}>
            {chainsMap.get(sourceChain)?.name}
          </Select.Trigger>
          <Select.Content>
            {CHAINS.map((item) => {
              return (
                <Select.Item key={item.key} value={item.key}>
                  {item.name}
                </Select.Item>
              );
            })}
          </Select.Content>
        </Select.Root>
      </Box>

      <Flex
        gridArea={'swap'}
        justify={'center'}
        align={'center'}
        display={{
          initial: 'none',
          xs: 'flex',
        }}
      >
        <IconButton size={'2'} variant='outline' radius='full'>
          <ArrowRightLeft size={14} />
        </IconButton>
      </Flex>

      <Box gridArea={'destination'}>
        <Text size={'1'} asChild>
          <label>Destination chain</label>
        </Text>
        <Select.Root
          value={destinationChain}
          onValueChange={(val: ChainType) => {
            setChain({ type: 'dest', value: val });
          }}
        >
          <Select.Trigger className={styles['select-trigger']}>
            {chainsMap.get(destinationChain)?.name}
          </Select.Trigger>
          <Select.Content>
            {CHAINS.map((item) => {
              return (
                <Select.Item key={item.key} value={item.key}>
                  {item.name}
                </Select.Item>
              );
            })}
          </Select.Content>
        </Select.Root>
      </Box>
    </Grid>
  );
}

export default memo(BridgeSelect);
