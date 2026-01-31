// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {Vm} from "forge-std/Vm.sol";
import {L2TokenBridge} from "../src/L2/L2TokenBridge.sol";

contract L2TokenBridgeDeployer is Script {
    function run() public {
        vm.startBroadcast();

        deploy();

        vm.stopBroadcast();
    }

    function deploy() internal {
        address deployedAddress = address(new L2TokenBridge());
        console.log("L2TokenBridge deployed to: ", deployedAddress);
    }
}
