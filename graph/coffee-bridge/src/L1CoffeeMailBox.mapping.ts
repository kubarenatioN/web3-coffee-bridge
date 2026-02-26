import { SendMessageCall as SendMessageCallType } from "../generated/L1CoffeeMailBox/BaseCoffeeMailBox";
import { SendMessageCall } from "../generated/schema";

export function handleSendMessage(call: SendMessageCallType): void {
  let entity = new SendMessageCall(
    call.transaction.hash.concatI32(call.transaction.index.toI32())
  );
  entity.from = call.from;
  entity.message = call.inputs.message;
  entity.mailboxAddress = call.to;
  entity.chainId = 11155111;

  entity.blockNumber = call.block.number;
  entity.blockTimestamp = call.block.timestamp;
  entity.transactionHash = call.transaction.hash;

  entity.save();
}
