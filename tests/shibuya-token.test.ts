import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import { handleTransferEvent } from "../src/shibuya-token";
import { createTransferEvent } from "./shibuya-token-utils";

describe("Describe entity assertions", () => {
  beforeAll(() => {
    const from = Address.fromString(
      "0x0000000000000000000000000000000000000000"
    );
    const to = Address.fromString("0x0000000000000000000000000000000000000002");
    const value = BigInt.fromString("3000000000000000000");
    const newTransferEvent = createTransferEvent(from, to, value);
    handleTransferEvent(newTransferEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Transfer entity created and owner field set", () => {
    // Memo: Check that exactly 1 Transfer entity exists
    assert.entityCount("Transfer", 1);

    // Check the value field
    assert.fieldEquals("Transfer", "0", "value", "3000000000000000000");

    // Check that the entity has the correct from address
    assert.fieldEquals(
      "Transfer",
      "0", //the id of the entity
      "from",
      "0x0000000000000000000000000000000000000000"
    );

    // Check that the entity has the correct to address
    assert.fieldEquals(
      "Transfer",
      "0",
      "to",
      "0x0000000000000000000000000000000000000002"
    );
  });
});
