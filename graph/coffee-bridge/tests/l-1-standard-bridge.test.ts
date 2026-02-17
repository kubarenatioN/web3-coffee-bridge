import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test
} from "matchstick-as/assembly/index";
import { handleERC20BridgeFinalized } from "../src/l-1-standard-bridge";
import { createERC20BridgeFinalizedEvent } from "./l-1-standard-bridge-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let localToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let remoteToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000001");
    let amount = BigInt.fromI32(234);
    let extraData = Bytes.fromI32(1234567890);
    let newERC20BridgeFinalizedEvent = createERC20BridgeFinalizedEvent(
      localToken,
      remoteToken,
      from,
      to,
      amount,
      extraData
    );
    handleERC20BridgeFinalized(newERC20BridgeFinalizedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ERC20BridgeFinalized created and stored", () => {
    assert.entityCount("ERC20BridgeFinalized", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ERC20BridgeFinalized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "localToken",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "ERC20BridgeFinalized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "remoteToken",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "ERC20BridgeFinalized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "from",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "ERC20BridgeFinalized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "to",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "ERC20BridgeFinalized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    );
    assert.fieldEquals(
      "ERC20BridgeFinalized",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "extraData",
      "1234567890"
    );

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  });
});
