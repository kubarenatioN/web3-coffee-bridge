// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {BaseCoffeeMailBox} from "../universal/contracts/BaseCoffeeMailBox.sol";
import {ICrossDomainMessenger} from "../interfaces/ICrossDomainMessenger.sol";

contract L1CoffeeMailBox is Initializable, BaseCoffeeMailBox {
    function initialize(
        address _initialOwner,
        ICrossDomainMessenger _messenger
    ) public initializer {
        __Base_init(_initialOwner, _messenger);
    }
}

// contract L1CoffeeMailBox {
//     event MessageReceived(
//         address indexed sender,
//         string message,
//         uint256 chainId
//     );
//     event MessageSent(address indexed sender, address indexed target);

//     mapping(uint256 => string) private messages;
//     mapping(uint256 => uint256) private messageChain;
//     mapping(uint256 => address) private senders;

//     uint256 private messageCount;

//     address private owner;
//     address private MESSENGER;
//     address private REMOTE_MAILBOX;

//     constructor() {
//         // _disableInitializers();
//     }

//     function initializer(
//         address _owner,
//         address _messenger,
//         address _remoteMailbox
//     ) public {
//         owner = _owner;
//         MESSENGER = _messenger;
//         REMOTE_MAILBOX = _remoteMailbox;
//     }

//     function sendMessage(string calldata message) public {
//         ICrossDomainMessenger(MESSENGER).sendMessage(
//             REMOTE_MAILBOX,
//             abi.encodeWithSelector(
//                 L2CoffeeMailBox.applyMessage.selector,
//                 msg.sender,
//                 message,
//                 block.chainid
//             ),
//             100_000
//         );

//         emit MessageSent(msg.sender, REMOTE_MAILBOX);
//     }

//     function applyMessage(
//         address sender,
//         string calldata message,
//         uint256 chainId
//     ) public {
//         messages[messageCount] = message;
//         messageChain[messageCount] = chainId;
//         senders[messageCount] = sender;

//         messageCount++;

//         emit MessageReceived(sender, message, chainId);
//     }
// }
