// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {CoffeeTokenV1} from "../src/CoffeeTokenV1.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Options} from "openzeppelin-foundry-upgrades/Options.sol";

contract CoffeeTokenDeploy is Script {
    function run() public {
        vm.startBroadcast();

        deploy();

        vm.stopBroadcast();
    }

    function deploy() public {
        console.log("Sender:", msg.sender);

        address initialOwner = address(
            0xeca102a0E8755cAC155cE219B7051db53D012dF2
        );
        address proxy = Upgrades.deployUUPSProxy(
            "CoffeeTokenV1.sol",
            abi.encodeCall(CoffeeTokenV1.initialize, (initialOwner))
        );

        CoffeeTokenV1 coffeeContract = CoffeeTokenV1(proxy);
        console.log("CoffeeTokenV1 deployed to", proxy);
        console.log("CoffeeTokenV1 getCoffee():", coffeeContract.getCoffee());
    }
}

contract CoffeeTokenUpgrade is Script {
    function run() public {
        vm.startBroadcast();

        // upgrade();

        vm.stopBroadcast();
    }

    // function upgrade() public {
    //     Options memory opts;
    //     opts.referenceContract = "CoffeeTokenV1.sol";

    //     Upgrades.upgradeProxy(
    //         "0x57Dd878989d16584bF3B3f84FfCcEa877b4054bD",
    //         "CoffeeTokenV2.sol",
    //         "",
    //         opts
    //     );
    // }
}
