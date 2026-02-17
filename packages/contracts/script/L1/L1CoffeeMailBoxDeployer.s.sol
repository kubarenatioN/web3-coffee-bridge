// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {L1CoffeeMailBox} from "../../src/L1/L1CoffeeMailBox.sol";
import {ICrossDomainMessenger} from "../../src/interfaces/ICrossDomainMessenger.sol";

contract L1CoffeeMailBoxDeployer is Script {
    function run() public {
        address owner = vm.envAddress("SEPOLIA_OWNER_ADDRESS");

        // for Sepolia
        address messenger = 0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef;

        vm.startBroadcast(msg.sender);

        address proxy = Upgrades.deployUUPSProxy(
            "L1CoffeeMailBox.sol",
            abi.encodeCall(
                L1CoffeeMailBox.initialize,
                (owner, ICrossDomainMessenger(messenger))
            )
        );

        vm.stopBroadcast();

        console.log("Deployed L1CoffeeMailBox proxy at:", proxy);

        string memory obj = "result";
        vm.serializeAddress(obj, "deployedAddress", proxy);
        string memory jsonOutput = vm.serializeAddress(
            obj,
            "ownerAddress",
            owner
        );
        vm.writeJson(jsonOutput, "deployment-mailbox-l1.json");
    }
}
