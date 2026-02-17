// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import {Vm} from "forge-std/Vm.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {L2CoffeeMailBox} from "../../src/L2/L2CoffeeMailBox.sol";
import {ICrossDomainMessenger} from "../../src/interfaces/ICrossDomainMessenger.sol";

contract L2CoffeeMailBoxDeployer is Script {
    string deployConfig;

    constructor() {
        string memory deployConfigPath = vm.envOr(
            "DEPLOY_CONFIG_MAILBOX_PATH",
            string("/configs/deploy-config-mailbox.toml")
        );
        string memory filePath = string.concat(
            vm.projectRoot(),
            deployConfigPath
        );
        deployConfig = vm.readFile(filePath);
    }

    modifier broadcast() {
        vm.startBroadcast(msg.sender);
        _;
        vm.stopBroadcast();
    }

    function setUp() public {}

    function run() public {
        string[] memory chainsToDeployTo = vm.parseTomlStringArray(
            deployConfig,
            ".deploy_config.chains"
        );

        address deployedAddress;
        address ownerAddr;

        for (uint256 i = 0; i < chainsToDeployTo.length; i++) {
            string memory chain = chainsToDeployTo[i];

            console.log("Deploying to chain:", chain);

            vm.createSelectFork(chain);

            address existing = _getDeployedAddress(chain);
            if (existing != address(0) && existing.code.length > 0) {
                console.log(
                    "L2CoffeeMailBox already deployed at:",
                    existing,
                    "on chain:",
                    chain
                );
                deployedAddress = existing;
                ownerAddr = vm.parseTomlAddress(
                    deployConfig,
                    ".contract.owner_address"
                );
                continue;
            }

            (address _deployedAddress, address _ownerAddr) = deployL2Contract();

            deployedAddress = _deployedAddress;
            ownerAddr = _ownerAddr;
        }

        outputDeploymentResult(deployedAddress, ownerAddr);
    }

    function deployL2Contract()
        public
        broadcast
        returns (address addr_, address ownerAddr_)
    {
        address remoteMessenger = vm.parseTomlAddress(
            deployConfig,
            ".contract.messenger"
        );
        ownerAddr_ = vm.parseTomlAddress(
            deployConfig,
            ".contract.owner_address"
        );

        addr_ = Upgrades.deployUUPSProxy(
            "L2CoffeeMailBox.sol",
            abi.encodeCall(
                L2CoffeeMailBox.initialize,
                (ownerAddr_, ICrossDomainMessenger(remoteMessenger))
            )
        );

        console.log(
            "Deployed L2CoffeeMailBox proxy at:",
            addr_,
            "on chain id:",
            block.chainid
        );
    }

    /// @notice Reads a previously deployed address for a chain from the config.
    ///         Converts chain name (e.g. "sepolia/op") to TOML key (e.g. "sepolia_op").
    ///         Returns address(0) if not set.
    function _getDeployedAddress(
        string memory chain
    ) internal view returns (address) {
        string memory sanitized = vm.replace(chain, "/", "_");
        string memory key = string.concat(
            ".deployed.",
            sanitized,
            ".address"
        );
        return vm.parseTomlAddress(deployConfig, key);
    }

    function outputDeploymentResult(
        address deployedAddress,
        address ownerAddr
    ) public {
        console.log("Outputting deployment result");

        string memory obj = "result";
        vm.serializeAddress(obj, "deployedAddress", deployedAddress);
        string memory jsonOutput = vm.serializeAddress(
            obj,
            "ownerAddress",
            ownerAddr
        );

        vm.writeJson(jsonOutput, "deployment-mailbox-l2.json");
    }
}
