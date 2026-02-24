import { isL1Chain } from '../helpers/chain.helper';
import type { MailBridgeStore } from './useMailBridgeStore';

export const mailboxAddressSelector = (state: MailBridgeStore) => {
  const { sourceChain } = state;

  const isSourceL1 = isL1Chain(sourceChain);

  // temp hardcode for OP testnet
  const L1_OP_MAILBOX_ADDRESS = '0x30a3509D71dce399dD99DD520e31F5BAc3f27b44';
  const L2_OP_MAILBOX_ADDRESS = '0x05A6E4D7c43B085EAF158a21B0A85997E978C958';

  return isSourceL1 ? L1_OP_MAILBOX_ADDRESS : L2_OP_MAILBOX_ADDRESS;
};
