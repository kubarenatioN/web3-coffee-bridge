import { CHAINS } from '@/shared/config/chains';
import type { ChainType } from '@/shared/types/chains.types';
import { Box, Flex, Grid, IconButton, Select, Text } from '@radix-ui/themes';
import { ArrowRightLeft } from 'lucide-react';
import { useReducer } from 'react';
import styles from './BridgeSelect.module.css';
import { chainsReducer } from './reducers';

const chainsMap = new Map(CHAINS.map((chain) => [chain.key, chain]));

function BridgeSelect() {
  const [chainsState, dispatchChain] = useReducer(chainsReducer, {
    sourceChain: 'op-sepolia',
    destinationChain: 'worldchain-sepolia',
  });

  const { sourceChain, destinationChain } = chainsState;

  return (
    <Grid
      areas={{
        initial: '"swap swap" "source destination"',
        xs: '"source swap destination"',
      }}
      columns={{
        initial: 'repeat(2, minmax(0, 1fr))',
        xs: 'minmax(0, 1fr) min-content minmax(0, 1fr)',
      }}
      rows={{
        initial: 'auto auto',
        xs: 'auto',
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
            dispatchChain({ type: 'set_source_chain', chain: val });
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

      <Flex gridArea={'swap'} justify={'center'} align={'center'}>
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
            dispatchChain({ type: 'set_destination_chain', chain: val });
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

export default BridgeSelect;
