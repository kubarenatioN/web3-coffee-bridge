// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract CoffeeToken is Initializable, ERC20Upgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Contract initializer
     */
    function initialize() public initializer {
        __ERC20_init("CoffeeToken", "COFFEE");
    }

    function getCoffee() public pure returns (string memory) {
        return "Coffee";
    }
}
