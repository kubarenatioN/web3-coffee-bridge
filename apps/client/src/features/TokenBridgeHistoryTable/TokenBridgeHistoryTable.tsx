import { BRIDGE_ADDRESS_TO_CHAIN } from '@/contracts/config';
import type { TokenBridgeRecord } from '@/shared/api/TokenBridgeHistory';
import { CHAINS_MAP } from '@/shared/config/chains';
import { Box, Flex, Text } from '@radix-ui/themes';
import { formatEther } from 'viem';

interface TableProps {
  data: TokenBridgeRecord[];
}

function TokenBridgeHistoryTable({ data }: TableProps) {
  return (
    <Box overflowX={'auto'}>
      <Flex direction={'column'} gap={'2'} minWidth={'480px'}>
        {data.map((el) => {
          return <TableRow key={el.id} data={el} />;
        })}
      </Flex>
    </Box>
  );
}

function TableRow({ data }: { data: TokenBridgeRecord }) {
  const { amount, blockTimestamp, bridgeAddress } = data;
  const timestamp = Number(blockTimestamp) * 1000;
  const date = new Date(timestamp).toLocaleString();

  const amountVal = !isNaN(Number(amount)) ? formatEther(BigInt(amount)) : '–';
  const chainKey = BRIDGE_ADDRESS_TO_CHAIN[bridgeAddress];
  const chain = CHAINS_MAP.get(chainKey);

  return (
    <Flex align={'center'}>
      <TableCell basis='100px'>
        <Text>amount: {amountVal}</Text>
      </TableCell>
      <TableCell basis='140px'>
        <Text size={'2'}>{chain?.name}</Text>
      </TableCell>
      <TableCell basis='100px'>
        <Text size={'2'}>{date}</Text>
      </TableCell>
    </Flex>
  );
}

function TableCell({
  children,
  basis,
}: {
  children: React.ReactNode;
  basis?: string;
}) {
  return (
    <Flex px={'2'} py={'1'} flexBasis={basis} flexGrow={'1'}>
      {children}
    </Flex>
  );
}

export default TokenBridgeHistoryTable;
