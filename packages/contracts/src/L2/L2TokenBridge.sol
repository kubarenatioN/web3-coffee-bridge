// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ISuperchainTokenBridge} from "@interop-lib/interfaces/ISuperchainTokenBridge.sol";

contract L2TokenBridge {
    ISuperchainTokenBridge public constant INTEROP_BRIDGE =
        ISuperchainTokenBridge(0x4200000000000000000000000000000000000028);

    event SuperchainSendERC20(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 destination
    );

    event SuperchainRelayERC20(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    constructor() {}

    function sendERC20(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _chainId
    ) external returns (bytes32 msgHash) {
        msgHash = INTEROP_BRIDGE.sendERC20(_token, _to, _amount, _chainId);
        emit SuperchainSendERC20(_token, msg.sender, _to, _amount, _chainId);
    }

    function relayERC20(
        address _token,
        address _from,
        address _to,
        uint256 _amount
    ) external {
        INTEROP_BRIDGE.relayERC20(_token, _from, _to, _amount);
        emit SuperchainRelayERC20(_token, _from, _to, _amount);
    }
}
