// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {CoffeeToken} from "../src/CoffeeToken.sol";

contract CoffeeTokenScript is Script {
    function run() public {
        vm.startBroadcast();
        // CoffeeToken coffeeToken = new CoffeeToken();
        // coffeeToken.initialize("CoffeeToken", "COFFEE");
        vm.stopBroadcast();
    }
}
