import { CHAINS } from '@/shared/config/chains';
import type { ChainType } from '@/shared/types/chains.types';
import { Box, Grid, IconButton, Select, Text } from '@radix-ui/themes';
import { ArrowRightLeft } from 'lucide-react';
import { useId, useReducer } from 'react';
import styles from './BridgeSelect.module.css';
import { chainsReducer } from './reducers';

const chainsMap = new Map(CHAINS.map((chain) => [chain.key, chain]));

function BridgeSelect() {
  const formId = useId();
  const [chainsState, dispatchChain] = useReducer(chainsReducer, {
    sourceChain: 'op-sepolia',
    destinationChain: 'worldchain-sepolia',
  });

  const { sourceChain, destinationChain } = chainsState;

  return (
    <Grid
      areas={{
        initial: '"swap swap" "source destination"',
        xs: 'none',
      }}
      columns={{
        initial: '1fr 1fr',
        xs: '1fr auto 1fr',
      }}
      rows={{
        initial: 'auto auto',
        xs: 'auto',
      }}
      align={'center'}
      gap={'2'}
    >
      <Box>
        <Text size={'1'} asChild>
          <label htmlFor={`${formId}-source-chain`}>Source chain</label>
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

      <IconButton size={'2'} variant='outline' radius='full'>
        <ArrowRightLeft size={14} />
      </IconButton>

      <Box>
        <Text size={'1'} asChild>
          <label htmlFor={`${formId}-source-chain`}>Destination chain</label>
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
