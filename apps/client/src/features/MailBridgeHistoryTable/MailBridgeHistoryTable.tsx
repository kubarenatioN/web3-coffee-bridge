import type { MailBridgeRecord } from '@/shared/api/MailBridgeHistory';
import { CHAINS, CHAINS_BY_ID } from '@/shared/config/chains';
import { Box, Flex, Text } from '@radix-ui/themes';

interface TableProps {
  data: MailBridgeRecord[];
}

function MailBridgeHistoryTable({ data }: TableProps) {
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

function TableRow({ data }: { data: MailBridgeRecord }) {
  const { message, blockTimestamp, chainId } = data;
  const timestamp = Number(blockTimestamp) * 1000;
  const date = new Date(timestamp).toLocaleString();

  const chain = CHAINS_BY_ID.get(chainId as (typeof CHAINS)[number]['id']);

  return (
    <Flex align={'center'}>
      <TableCell basis='200px'>
        <Text truncate>{message}</Text>
      </TableCell>
      <TableCell basis='140px'>
        <Text size={'2'}>{chain?.name ?? `Chain ${chainId}`}</Text>
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

export default MailBridgeHistoryTable;
