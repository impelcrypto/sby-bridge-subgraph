import { Transfer as TransferEvent } from "../generated/ShibuyaToken/ShibuyaToken";
import { Transfer } from "../generated/schema";

export function handleTransferEvent(event: TransferEvent): void {
  // Memo: find from Transfer entity if it exists
  let entity = Transfer.load(event.transaction.hash.toString());
  const isMintToken =
    event.params.from.toString() ===
    "0x0000000000000000000000000000000000000000";

  // Memo: No need to save if it is transfer between wallet addresses
  if (!isMintToken) {
    return;
  }

  if (entity) {
    entity.to = event.params.to;
    entity.from = event.params.from;
    entity.value = event.params.value;
    entity.transactionHash = event.transaction.hash;
    entity.blockNumber = event.block.number;

    // save the entity
    entity.save();

    return;
  }

  // create a new entity
  entity = new Transfer(event.transaction.hash.toString());

  entity.to = event.params.to;
  entity.from = event.params.from;
  entity.value = event.params.value;
  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  // save the entity
  entity.save();
}
