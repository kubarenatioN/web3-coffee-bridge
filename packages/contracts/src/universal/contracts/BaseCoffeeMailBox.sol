// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {ICrossDomainMessenger} from "../../interfaces/ICrossDomainMessenger.sol";

error InvalidRemoteMailboxAddress();
error RemoteMailboxAlreadySet();

abstract contract BaseCoffeeMailBox is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    event MessageReceived(
        address indexed sender,
        string message,
        uint256 chainId
    );
    event MessageSent(address indexed sender, address indexed target);

    mapping(uint256 => string) internal messages;
    mapping(uint256 => uint256) internal messageChain;
    mapping(uint256 => address) internal senders;

    uint256 internal messageCount;

    ICrossDomainMessenger internal MESSENGER;
    BaseCoffeeMailBox internal REMOTE_MAILBOX;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function __Base_init(
        address _initialOwner,
        ICrossDomainMessenger _messenger
    ) internal onlyInitializing {
        __Ownable_init(_initialOwner);
        MESSENGER = _messenger;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function setRemoteMailbox(address _remoteMailbox) public onlyOwner {
        if (_remoteMailbox == address(0)) {
            revert InvalidRemoteMailboxAddress();
        }
        if (address(REMOTE_MAILBOX) != address(0)) {
            revert RemoteMailboxAlreadySet();
        }

        REMOTE_MAILBOX = BaseCoffeeMailBox(_remoteMailbox);
    }

    function sendMessage(string calldata message) public {
        ICrossDomainMessenger(MESSENGER).sendMessage(
            address(REMOTE_MAILBOX),
            abi.encodeWithSelector(
                this.applyMessage.selector,
                msg.sender,
                message,
                block.chainid
            ),
            100_000
        );

        emit MessageSent(msg.sender, address(REMOTE_MAILBOX));
    }

    function applyMessage(
        address sender,
        string calldata message,
        uint256 chainId
    ) public {
        require(
            msg.sender == address(MESSENGER),
            "CoffeeMailbox: Direct sender must be the CrossDomainMessenger"
        );
        require(
            MESSENGER.xDomainMessageSender() == address(REMOTE_MAILBOX),
            "CoffeeMailbox: Remote sender must be the other CoffeeMailbox contract"
        );

        messages[messageCount] = message;
        messageChain[messageCount] = chainId;
        senders[messageCount] = sender;

        messageCount++;

        emit MessageReceived(sender, message, chainId);
    }

    function getMessage(uint256 messageId) public view returns (string memory) {
        return messages[messageId];
    }

    function getMessageChain(uint256 messageId) public view returns (uint256) {
        return messageChain[messageId];
    }

    function getSender(uint256 messageId) public view returns (address) {
        return senders[messageId];
    }

    function getMessagesCount() public view returns (uint256) {
        return messageCount;
    }
}
